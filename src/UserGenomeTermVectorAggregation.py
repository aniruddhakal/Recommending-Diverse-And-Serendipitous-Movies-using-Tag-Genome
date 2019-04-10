import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from time import time
from DataLoaderPreprocessor import DataLoaderPreprocessor

data_base_dir = '../../datasets/Movielens/'
target_directory = 'output/'

dataset = 'ml20m'
# dataset = 'serendipity2018'

data_dir = data_base_dir + 'ml-20m/'

if dataset is 'serendipity2018':
    data_dir = data_base_dir + 'serendipity-sac2018/'


def main(save_flag):
    stemmed = 'stemmed'
    unstemmed = 'unstemmed'

    option = unstemmed

    if option == stemmed:
        target_file = 'user_stemmed_genome_terms_df_gzip'
    else:
        target_file = 'user_unstemmed_genome_terms_df_gzip'

    data_loader = DataLoaderPreprocessor(base_dir=data_base_dir, ml20m='ml-20m/', serendipity2018='serendipity-sac2018/')
    ratings_df, genome_scores_df, movies_df = data_loader.load_and_preprocess_data(dataset)

    file_name = "movies_genome_vector.csv"
    if option == stemmed:
        genomes_term_vector_df = pd.read_csv(data_dir + file_name, index_col=0)
    else:
        genomes_term_vector_df = genome_scores_df

    # TODO change approach to p-mean based approach
    #  user genome term vector aggregation
    def generate_user_genome_terms(user_id):
        user_id % 1000 == 0 and print(user_id)
        users_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

        return genomes_term_vector_df.loc[users_movies].mean()

    all_user_ids = ratings_df['userId'].unique()

    user_genome_terms_df = pd.DataFrame(index=all_user_ids)
    user_genome_terms_df[0] = ''

    start = time()
    user_genome_terms_df = user_genome_terms_df.apply(lambda x: generate_user_genome_terms(x.name), axis=1)
    finish = time() - start
    print("Total Time %s seconds" % str(finish))

    # save pickle file
    save_flag and user_genome_terms_df.to_pickle(data_dir + target_directory + target_file, compression='gzip')
    print(user_genome_terms_df.head())


if __name__ == '__main__':
    save_flag = False
    main(save_flag)
