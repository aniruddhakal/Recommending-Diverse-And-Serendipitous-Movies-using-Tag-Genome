import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from time import time
from DataLoaderPreprocessor import DataLoaderPreprocessor

data_base_dir = '../../datasets/Movielens/'

dataset = 'ml20m'
# dataset = 'serendipity2018'

data_dir = data_base_dir + 'ml-20m/'

if dataset is 'serendipity2018':
    data_dir = data_base_dir + 'serendipity-sac2018/'

target_directory = data_dir + 'output/'


def main(save_flag, full_terms_target_file_name, lemmatized_terms_target_file_name,
         lemmatized_movies_term_vector_pickle, compression, ratings_df, genome_scores_df,
         load_explicitly=False):
    lemmatized = 'lemmatized'
    full = 'full'

    option = lemmatized

    main_start = time()

    for option in [lemmatized, full]:

        if option == lemmatized:
            target_file = lemmatized_terms_target_file_name
        else:
            target_file = full_terms_target_file_name

        file_name = lemmatized_movies_term_vector_pickle
        if option == lemmatized or load_explicitly:
            # genomes_term_vector_df = pd.read_csv(data_dir + file_name, index_col=0)
            genomes_term_vector_df = pd.read_pickle(target_directory + file_name, compression=compression)
        else:
            genomes_term_vector_df = genome_scores_df

        # TODO change approach to p-mean based approach
        #  user genome term vector aggregation
        user_movies_df = pd.DataFrame(
            ratings_df.loc[:, ['userId', 'movieId']].groupby('userId')['movieId'].apply(list))

        def generate_user_genome_terms2(x):
            x.name % 1000 == 0 and print(x.name)
            return genomes_term_vector_df.loc[x['movieId'], :].mean()

        start_time = time()
        user_genome_terms_df = user_movies_df.apply(lambda x: generate_user_genome_terms2(x),
                                                    axis=1)
        finish_time = time() - start_time

        print("Total time %f seconds" % finish_time)

        def generate_user_genome_terms(user_id):
            user_id % 1000 == 0 and print(user_id)
            users_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

            return genomes_term_vector_df.loc[users_movies].mean()

        # all_user_ids = ratings_df['userId'].unique()

        # user_genome_terms_df = pd.DataFrame(index=all_user_ids)
        # user_genome_terms_df[0] = ''
        #
        # start = time()
        # user_genome_terms_df = user_genome_terms_df.apply(lambda x: generate_user_genome_terms(x.name), axis=1)
        # finish = time() - start
        # print("Total Time %s seconds" % str(finish))

        # save pickle file
        save_flag and user_genome_terms_df.to_pickle(target_directory + target_file,
                                                     compression=compression)
        print("\n\nsaving the term vector to the pickle file...\n", user_genome_terms_df.head())

    main_finish = time() - main_start
    print("Total Time %s seconds" % str(main_finish))


if __name__ == '__main__':
    save_flag = True
    compression = 'bz2'

    data_loader = DataLoaderPreprocessor(base_dir=data_base_dir, ml20m='ml-20m/',
                                         serendipity2018='serendipity-sac2018/')
    ratings_df, genome_scores_df, movies_df = data_loader.load_and_preprocess_data(dataset)

    threshold_values = [0.25, 0.3, 0.35, 0.4]

    for threshold_value in threshold_values:
        # lemmatized_terms_target_file_name = 'user_lemmatized_genome_terms_df_gzip'
        # full_terms_target_file_name = 'user_full_genome_terms_df_gzip'

        # lemmatized_movies_term_vector_pickle = 'output/movies_lemmatized_genome_vector_df_bz2'

        lemmatized_terms_target_file_name = 'threshold_' + str(
            threshold_value) + '_user_lemmatized_genome_terms_df_gzip'

        full_terms_target_file_name = 'threshold_' + str(
            threshold_value) + '_user_full_genome_terms_df_gzip'

        lemmatized_movies_term_vector_pickle = 'movies_lemmatized_' + 'threshold_' + str(
            threshold_value) + '_float_movie_genomes_bz2'

        main(save_flag, full_terms_target_file_name, lemmatized_terms_target_file_name,
             lemmatized_movies_term_vector_pickle, compression, ratings_df, genome_scores_df,
             load_explicitly=True)
