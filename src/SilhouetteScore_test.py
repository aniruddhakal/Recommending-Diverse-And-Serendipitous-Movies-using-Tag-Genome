import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from time import time
from sklearn.cluster import KMeans
from sklearn.cluster import DBSCAN
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import silhouette_score

data_base_dir = '../../datasets/Movielens/'
data_dir = data_base_dir + 'serendipity-sac2018/'
data_dir2 = data_base_dir + 'ml-20m/'

genome_scores = data_dir + 'tag_genome.csv'
# genome_tags = data_dir + 'genome-tags.csv'
movies = data_dir + 'movies.csv'
# ratings = data_dir + 'ratings.csv'
ratings = data_dir + 'training.csv'
# tags = data_dir + 'tags.csv'
answers = data_dir + 'answers.csv'

genomes_df = pd.read_csv(genome_scores).pivot(index='movieId', columns='tagId', values='relevance')
genome_score_movies = genomes_df.index.values
ratings_df = pd.read_csv(ratings, usecols=range(3),
                         dtype={'userId': np.int64, 'movieId': np.int64, 'rating': np.float64},
                         low_memory=False)
ratings_df = ratings_df[ratings_df['movieId'].isin(genome_score_movies)]


def get_users_best_silhouette_score(user_id, genome_scores_df):
    user_movie_tags_df = pd.DataFrame()
    user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values
    user_movie_tags_df = genome_scores_df[genome_scores_df.index.isin(user_movies)]
    n_movies = user_movie_tags_df.index.size

    highest_score = 0
    optimal_cluster_size = 2

    print('user_id: ', user_id)
    user_movies_matrix = np.nan_to_num(user_movie_tags_df.values[:n_movies])

    for cluster_size in range(2, n_movies - 1, 1):
        #     kmeans = KMeans(n_clusters=cluster_size, random_state=random_state, n_jobs=-1).fit(user_movie_tags_df.values)
        result = AgglomerativeClustering(n_clusters=cluster_size, affinity='euclidean',
                                         linkage='ward').fit_predict(user_movies_matrix)
        score = silhouette_score(user_movies_matrix, result, metric='cosine')
        #         cluster_size_silhouette_score_d[cluster_size] = score

        if score >= highest_score:
            highest_score = score
            optimal_cluster_size = cluster_size

    return highest_score, optimal_cluster_size


def get_best_silhouette_score_for_all_movies(genome_scores_df):
    score_history = []
    cluster_size_hist = []
    best_score = -1
    best_cluster_size = 0

    for cluster_size in range(2, 30, 5):
        #         result = KMeans(n_clusters=cluster_size, random_state=171450, n_jobs=-1).fit_predict(genome_scores_df.values)
        result = AgglomerativeClustering(n_clusters=cluster_size, affinity='euclidean',
                                         linkage='ward').fit_predict(genome_scores_df.values)

        score = silhouette_score(genome_scores_df.values, result, metric='cosine')

        score_history.append(score)
        cluster_size_hist.append(cluster_size)

        if best_score < score:
            best_score = score
            best_cluster_size = cluster_size

    return score_history, cluster_size_hist, best_score, best_cluster_size


def get_all_users_mean_best_scores(genomes_df, test_users):
    plt.clf()
    score_history = list()
    optimal_cluster_size_hist = list()

    best_user = 0
    best_score = 0

    for user in test_users:
        highest_score, optimal_cluster_size = get_users_best_silhouette_score(user, genomes_df)
        score_history.append(highest_score)

        if best_score < highest_score:
            best_score = highest_score
            best_user = user

        optimal_cluster_size_hist.append(optimal_cluster_size)

    print('highest_score', best_score)
    print('best_user', best_user)

    return np.array(score_history).mean()


tag_genome_df = pd.read_csv(genome_scores).pivot(index='movieId', columns='tagId',
                                                 values='relevance')


def get_results_for_all_dfs(test_users):
    genome_df_list = [tag_genome_df, 'movies_lemmatized_genome_vector_df_bz2', \
                      'threshold_0.25_float_movie_genomes_bz2', \
                      'movies_lemmatized_threshold_0.25_float_movie_genomes_bz2', \
                      'threshold_0.3_float_movie_genomes_bz2', \
                      'movies_lemmatized_threshold_0.3_float_movie_genomes_bz2', \
                      'threshold_0.35_float_movie_genomes_bz2', \
                      'movies_lemmatized_threshold_0.35_float_movie_genomes_bz2', \
                      'threshold_0.4_float_movie_genomes_bz2', \
                      'movies_lemmatized_threshold_0.4_float_movie_genomes_bz2', \
                      'threshold_0.6_float_movie_genomes_bz2', \
                      'movies_lemmatized_threshold_0.6_float_movie_genomes_bz2', \
                      'threshold_0.7_float_movie_genomes_bz2', \
                      'movies_lemmatized_threshold_0.7_float_movie_genomes_bz2']
    df_names = ['full_genomes', 'movies_lemmatized_genome_vector_df_bz2', \
                'threshold_0.25_float_movie_genomes_bz2', \
                'movies_lemmatized_threshold_0.25_float_movie_genomes_bz2', \
                'threshold_0.3_float_movie_genomes_bz2', \
                'movies_lemmatized_threshold_0.3_float_movie_genomes_bz2', \
                'threshold_0.35_float_movie_genomes_bz2', \
                'movies_lemmatized_threshold_0.35_float_movie_genomes_bz2', \
                'threshold_0.4_float_movie_genomes_bz2', \
                'movies_lemmatized_threshold_0.4_float_movie_genomes_bz2', \
                'threshold_0.6_float_movie_genomes_bz2', \
                'movies_lemmatized_threshold_0.6_float_movie_genomes_bz2', \
                'threshold_0.7_float_movie_genomes_bz2', \
                'movies_lemmatized_threshold_0.7_float_movie_genomes_bz2']

    scores_df = pd.DataFrame()

    for index, genomes_df in enumerate(genome_df_list):
        print('processing for: ', df_names[index])
        if type(genomes_df) is str:
            genomes_df = pd.read_pickle(data_dir + 'output/' + genomes_df, compression='bz2')

        mean_best_score = get_all_users_mean_best_scores(genomes_df, test_users)
        print('mean_best_score', mean_best_score, '\n')
        ser = pd.Series()
        ser.name = df_names[index]
        ser['mean_best_score'] = mean_best_score
        scores_df = scores_df.append(ser)

    scores_df.plot(kind='barh')
    plt.show()


# only select users who have answered for 5 recommendations,
#  at max there are 5 recommendations per user

answers_df = pd.read_csv(answers)
count_df = answers_df.groupby('userId').count()
all_user_ids = count_df[count_df['movieId'] == 5].index.values

if __name__ == '__main__':
    test_users = all_user_ids[:93]

    start = time()
    get_results_for_all_dfs(test_users)
    finish = time() - start
    print('Total time: %f seconds' % finish)
