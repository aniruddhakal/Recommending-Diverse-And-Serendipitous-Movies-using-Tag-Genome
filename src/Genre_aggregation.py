# %%
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

data_base_dir = '../../datasets/Movielens/'
data_dir = data_base_dir + 'serendipity-sac2018/'
data_dir2 = data_base_dir + 'ml-20m/'

outpur_dir = data_dir + 'output4/'

# genome_scores = data_dir + 'genome-scores.csv'
# ratings = data_dir + 'ratings.csv'

genome_tags = data_dir + 'genome-tags.csv'

movies = data_dir + 'movies.csv'

tags = data_dir + 'tags.csv'
genres = data_dir + 'u.genre'

# serendipity-sac2018
# genome_scores = data_dir + 'tag_genome.csv'
genome_scores = data_dir + 'mlLatestgenome-scores.csv'

ratings = data_dir + 'training.csv'
answers = data_dir + 'answers.csv'
recommendations = data_dir + 'recommendations.csv'
# %%
# ratings_df = ratings_df[ratings_df['userId'].isin(range(1, 10000))]
# ratings_matrix_df = ratings_df.pivot(index='userId', columns='movieId', values='rating')

answers_df = pd.read_csv(answers)
count_df = answers_df.groupby('userId').count()
all_user_ids = count_df[count_df['movieId'] == 5].index.values.tolist()

recommendations_df = pd.read_csv(recommendations)
all_user_ids.extend(recommendations_df['userId'].unique().tolist())
all_user_ids = np.unique(np.array(all_user_ids))

genome_scores_df = pd.read_csv(genome_scores)
movies_with_genomes = genome_scores_df['movieId'].unique()

ratings_df = pd.read_csv(ratings, usecols=range(3),
                         dtype={'userId': np.int32, 'movieId': np.int32, 'rating': np.float64},
                         low_memory=False)

# filter out movies only with genome scores
ratings_df = ratings_df[ratings_df['movieId'].isin(movies_with_genomes)]
# filter out movies only for users under test
ratings_df = ratings_df[ratings_df['userId'].isin(all_user_ids)]
# %%
ratings_df.groupby('userId').count()
# %%
# movies = data_dir + 'movies.csv'
movies_df = pd.read_csv(movies)

# select movies only with tag-genome scores
movies_df = movies_df[movies_df['movieId'].isin(movies_with_genomes)]
# %%
genres_df = pd.read_csv(genres, sep='|', header=None)
# genres_df = pd.pivot_table(index='1', columns='')
genres_df = genres_df.set_index(genres_df.loc[:, 0].values, drop=True)
# genres_df.to_dict()[0]
genres_df = genres_df.drop(labels=[0], axis=1)
genres_dict = genres_df.to_dict()[1]
genres_dict['IMAX'] = 19
# %%
# select all movie ids
# remove movies with (no genres listed)
print(movies_df.shape)
movies_df.dropna(subset=['genres'], inplace=True)
all_movie_ids = movies_df[movies_df['genres'] != '(no genres listed)']['movieId'].unique()
# %%
# generate genre Binary term vector for each movie

output_file = outpur_dir + 'movie_genre_binary_term_vector.csv'
target_file = open(output_file, 'w+')

output_string = ''
for movieId in all_movie_ids:
    # print("movie under test", movieId)
    genres_list = movies_df[movies_df['movieId'] == movieId]['genres'].tolist()[0].split(',')
    genre_vector = np.zeros(20, dtype=np.int32)

    for genre in genres_list:
        genre_vector[genres_dict[genre]] = 1

    output_string += "%d," % movieId + str(genre_vector) + "\n"

target_file.write(output_string)
target_file.close()
# %%
from io import StringIO

the_file = open(output_file)
string = the_file.read()
string = string.replace('[', '')
string = string.replace(']', '')
string = string.replace(' ', ',')

binary_term_vector_df = pd.read_csv(StringIO(string), header=None, dtype={})
binary_term_vector_df.set_index(movies_df['movieId'], drop=True, inplace=True)
binary_term_vector_df.drop(columns=[0], inplace=True)
binary_term_vector_df.to_pickle(outpur_dir + 'movie_genre_binary_term_vector_df_bz2', compression='bz2')
# %%
# movies watched by user:
# user_id = 10
from time import time

start = time()


# no_genre_movies = movies_df[movies_df['genres'] == '(no genres listed)']['movieId'].unique()

def generate_user_int_terms(user_id):
    users_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

    # omit movies where value is (no genres listed)
    #     users_movies = np.setdiff1d(users_movies, no_genre_movies)

    user_int_term_vector_df = pd.DataFrame(columns=binary_term_vector_df.columns)

    # integer term vector for movies watched by user
    return binary_term_vector_df.loc[users_movies].sum()[1:]


user_int_terms_df = pd.DataFrame(index=all_user_ids)
user_int_terms_df[0] = ''

user_int_terms_df = user_int_terms_df.apply(lambda x: generate_user_int_terms(x.name), axis=1)

# finish = time() - start
# print("Total Time %s seconds" % str(finish))
# %%
user_mini_int_terms_df = pd.DataFrame(index=all_user_ids[:100])
user_mini_int_terms_df[0] = ''

user_int_terms_df.to_pickle(outpur_dir + 'user_int_terms_df')
# %%
user_int_terms_df.to_pickle(outpur_dir + 'user_int_terms_df_gzip', compression='gzip')
user_int_terms_df.to_pickle(outpur_dir + 'user_int_terms_df_bz2', compression='bz2')
user_int_terms_df.to_pickle(outpur_dir + 'user_int_terms_df_zip', compression='zip')
user_int_terms_df.to_pickle(outpur_dir + 'user_int_terms_df_xz', compression='xz')
# %%
user_int_terms_df = pd.read_pickle(outpur_dir + 'user_int_terms_df_bz2', compression='bz2')
# %%
user_int_terms_df.sum(axis=0)
# %%
user_int_terms_df.to_dict('index')

output_string = ""
for index in user_int_terms_df.index:
    output_string += "%d," % index + str(user_int_terms_df.loc[index, :].values).replace("\n",
                                                                                         " ") + "\n"
#     print(output_string)
# output_string += "%d," % movieId + str(genre_vector) + "\n"

target = outpur_dir + 'user_int_terms.csv'
target_file = open(target, 'w+')
target_file.write(output_string)
target_file.close()
# %%
binary_term_vector_df
# %%
