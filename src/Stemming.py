from time import time

import numpy as np
import pandas as pd
from nltk.stem import PorterStemmer
from nltk.stem import WordNetLemmatizer

data_base_dir = '../../datasets/Movielens/'
data_dir2 = data_base_dir + 'Movielens Latest/ml-latest/'
data_dir = data_base_dir + 'ml-20m/'

genome_scores = data_dir2 + 'genome-scores.csv'
genome_tags = data_dir + 'genome-tags.csv'
movies = data_dir + 'movies.csv'
ratings = data_dir + 'ratings.csv'
tags = data_dir + 'tags.csv'

lemmatizer = WordNetLemmatizer()

def map_lemmatized_word(x, lemmatized_word):
    x = x.split()

    for w in x:
        w1 = w.replace("(", "")
        w1 = w1.replace(")", "")

        # if w1.startswith(lemmatized_word):
        #     return True
        a = str(lemmatizer.lemmatize(w1, pos='a'))
        r = str(lemmatizer.lemmatize(w1, pos='r'))
        n = str(lemmatizer.lemmatize(w1, pos='n'))
        v = str(lemmatizer.lemmatize(w1, pos='v'))
        s = str(lemmatizer.lemmatize(w1, pos='s'))

        # if str(lemmatizer.lemmatize(w1, pos='v')) == lemmatized_word:
        #     return True
        if a == lemmatized_word or r == lemmatized_word or n == lemmatized_word or v == lemmatized_word or s == lemmatized_word:
            return True

    return False


def apply_lemmatization_mapping(stemming_phrases, genome_tags_df):
    lemma_dict = {}

    candidate_words = genome_tags_df['tag'].values

    for w in candidate_words:
        lemma = lemmatizer.lemmatize(w, pos='v')
        match_condition = genome_tags_df.apply(lambda x: map_lemmatized_word(x['tag'], lemma), axis=1)
        mapped_list = genome_tags_df[match_condition]['tag'].values.tolist()

        if len(mapped_list) > 0:
            lemma_dict[lemma] = genome_tags_df[match_condition]['tag'].values.tolist()

    return lemma_dict


def drop_singular_value_keys(stemming_dict):
    print("# of Dictionary keys before dropping singular values: %d" % len(stemming_dict))

    stemming_dict = {k: v for k, v in stemming_dict.items() if len(v) > 1}

    print("# of Dictionary keys after dropping singular values: %d" % len(stemming_dict))


def print_dict_value_count(stemming_dict):
    value_list = list(stemming_dict.values())

    count = 0

    for l in value_list:
        count += len(l)

    print(count)


def remove_redundant_keys(stem_dict):
    value_list = list(stem_dict.values())

    for l in value_list:
        for w in l:
            w = w.replace("(", "")
            w = w.replace(")", "")

            if w in stem_dict and len(stem_dict[w]) == 1:
                del stem_dict[w]


def map_similar_values_to_keys(stemming_dict, genome_tags_df):
    # all values from dictionary
    all_dict_values = list()
    for l in list(stemming_dict.values()):
        all_dict_values.extend(l)

    all_dict_values = np.array(all_dict_values)
    all_tags = genome_tags_df['tag'].values

    # difference
    remaining_tags = np.setdiff1d(all_tags, all_dict_values)

    # now apply similar value mapping for remaining tags
    new_stemming_dict = {}

    for stemmed_word in remaining_tags:
        match_condition = genome_tags_df.apply(lambda x: map_lemmatized_word(x['tag'], stemmed_word), axis=1)
        mapped_list = genome_tags_df[match_condition]['tag'].values.tolist()

        if len(mapped_list) > 0:
            new_stemming_dict[stemmed_word] = mapped_list

    return new_stemming_dict


def generate_genome_term_vector(final_stemming_dict, genome_tags_df, genome_scores_df):
    new_keys = list(final_stemming_dict.keys())
    stemmed_tag_relevance_df = pd.DataFrame(index=genome_scores_df.index, columns=sorted(new_keys))

    start_time = time()

    def process(movie_ids, key):
        # select tag ID's for values from the list
        mapped_values = np.array(final_stemming_dict[key])
        mapped_tag_ids = genome_tags_df[genome_tags_df.isin(mapped_values)].dropna().index.values

        # calculate the target sum for underlying tags
        return genome_scores_df.loc[movie_ids, mapped_tag_ids].sum(axis=1)

    stemmed_tag_relevance_df = stemmed_tag_relevance_df.apply(lambda x: process(x.index, x.name))

    # alternative for huge data, using swifter, to utilize multi-cores
    # stemmed_tag_relevance_df = stemmed_tag_relevance_df.swifter.apply(lambda x: process(x.index, x.name))

    finish = time() - start_time

    print("Total time taken %f" % finish + " seconds")

    return stemmed_tag_relevance_df


def save_csv(filename, dataframe):
    dataframe.to_csv(filename)


def main():
    # preparing tag_genomes mapping
    genome_tags_df = pd.read_csv(genome_tags)
    genome_tags_df.set_index(genome_tags_df['tagId'].values, drop=True, inplace=True)
    genome_tags_df.drop(labels='tagId', axis=1, inplace=True)

    # TODO think of better stemming phrases
    stemming_phrases = ['ies', 's', 'ed', 'ion']

    # perform lemmatization
    stemming_dict = apply_lemmatization_mapping(stemming_phrases, genome_tags_df)

    remove_redundant_keys(stemming_dict)

    # apply similar value mapping for remaining values
    new_stemming_dict = map_similar_values_to_keys(stemming_dict, genome_tags_df)

    final_stemming_dict = {**stemming_dict, **new_stemming_dict}
    print("Final Stemming Dictionary: " + str(final_stemming_dict))
    print(len(final_stemming_dict.values()))
    print_dict_value_count(final_stemming_dict)

    # generate new tag genome summed up values for new keys
    genome_scores_df = pd.read_csv(genome_scores)
    movies_df = pd.read_csv(movies)
    ratings_df = pd.read_csv(ratings, usecols=range(3),
                             dtype={'userId': np.int32, 'movieId': np.int32, 'rating': np.float64}, low_memory=False)
    all_user_ids = ratings_df['userId'].unique()
    all_movie_ids = movies_df[movies_df['genres'] != '(no genres listed)']['movieId'].unique()
    genome_scores_df = genome_scores_df[genome_scores_df['movieId'].isin(all_movie_ids)]
    genome_scores_df = genome_scores_df.pivot(index='movieId', columns='tagId', values='relevance')

    final_genome_vector_df = generate_genome_term_vector(final_stemming_dict, genome_tags_df, genome_scores_df)
    print(final_genome_vector_df.head())

    # TODO enable to save csv file
    save_csv_flag = False

    if save_csv_flag:
        file_name = "movies_genome_vector.csv"
        save_csv(data_dir + file_name, final_genome_vector_df)


if __name__ == '__main__':
    main()
