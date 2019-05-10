import numpy as np
import pandas as pd


class DataLoaderPreprocessor:

    def __init__(self, base_dir='../../datasets/Movielens/', ml20m='ml-20m/', serendipity2018='serendipity-sac2018/'):
        self.ratings_df = None
        self.genome_scores_df = None
        self.movies_df = None

        self.movie_genre_binary_terms_df = None
        self.movies_lemmatized_genome_term_vector_df = None
        self.user_int_genre_terms_df = None
        self.user_genre_binary_term_vector_df = None
        self.user_lemmatized_genome_terms_df = None
        self.user_full_genome_terms_df = None

        self.base_dir = base_dir

        # dataset_dir
        self.ml20m = self.base_dir + ml20m
        self.serendipity2018 = base_dir + serendipity2018
        self.answers = serendipity2018 + 'answers.csv'

        self.data_output_dir = 'output/'

        self.dataset_files = {
            'ml20m': {
                'genome_scores': 'genome-scores.csv',
                'movies': 'movies.csv',
                'ratings': 'ratings.csv',

                'movie_genre_binary_terms': 'movie_genre_binary_term_vector_df_bz2',
                'user_int_genre_terms': 'user_int_terms_df_bz2',
                'user_genre_binary_terms': 'user_genre_binary_terms_df_bz2',
                'user_lemmatized_genome_terms': 'user_lemmatized_genome_terms_df_bz2',
                'user_full_genome_terms': 'user_full_genome_terms_df_bz2',
                'movies_genome_term_vector': 'movies_lemmatized_genome_vector_df_bz2'
            },
            'serendipity2018': {
                'genome_scores': 'tag_genome.csv',
                'movies': 'movies.csv',
                'ratings': 'training.csv',
                'answers': 'answers.csv',

                'movie_genre_binary_terms': 'movie_genre_binary_term_vector_df_bz2',
                'user_int_genre_terms': 'user_int_terms_df_bz2',
                'user_genre_binary_terms': 'user_genre_binary_terms_df_bz2',
                'user_lemmatized_genome_terms': 'user_lemmatized_genome_terms_df_bz2',
                'user_full_genome_terms': 'user_full_genome_terms_df_bz2',
                'movies_genome_term_vector': 'movies_lemmatized_genome_vector_df_bz2'
            }
        }

        self.all_movie_ids = None

    def init_dataset(self, dataset):
        dataset_dir = None

        if dataset is 'serendipity2018':
            dataset_dir = self.base_dir + self.serendipity2018
        elif dataset is 'ml20m':
            dataset_dir = self.base_dir + self.ml20m

        return dataset_dir

    def init_file_names(self, dataset):
        dataset_dir = self.init_dataset(dataset)

        genome_scores = dataset_dir + self.dataset_files[dataset]['genome_scores']
        movies = dataset_dir + self.dataset_files[dataset]['movies']
        ratings = dataset_dir + self.dataset_files[dataset]['ratings']

        return genome_scores, movies, ratings

    def init_user_data_file_names(self, dataset):
        dataset_dir = self.init_dataset(dataset)

        movie_genre_binary_terms = dataset_dir + self.data_output_dir + self.dataset_files[dataset][
            'movie_genre_binary_terms']
        user_int_genre_terms = dataset_dir + self.data_output_dir + self.dataset_files[dataset]['user_int_genre_terms']
        user_genre_binary_terms = dataset_dir + self.data_output_dir + self.dataset_files[dataset][
            'user_genre_binary_terms']

        user_lemmatized_genome_terms = dataset_dir + self.data_output_dir + self.dataset_files[dataset][
            'user_lemmatized_genome_terms']
        user_full_genome_terms = dataset_dir + self.data_output_dir + self.dataset_files[dataset][
            'user_full_genome_terms']
        movies_genome_term_vector = dataset_dir + self.data_output_dir + self.dataset_files[dataset][
            'movies_genome_term_vector']

        return movie_genre_binary_terms, movies_genome_term_vector, user_int_genre_terms, user_genre_binary_terms, user_lemmatized_genome_terms, user_full_genome_terms

    def load_and_preprocess_data(self, dataset, load_list=['ratings', 'genomes', 'movies']):
        loader_check_list = ['movies', 'ratings', 'genomes']
        difference_list = list(set(loader_check_list).difference(set(load_list)))

        output_list = []

        print("\nLoading data: movies, ratings, genome-scores...")
        genome_scores, movies, ratings = self.init_file_names(dataset)

        # load all movies in df,
        self.movies_df = pd.read_csv(movies)

        # load tag-genome scores df
        self.genome_scores_df = pd.read_csv(genome_scores)
        self.genome_scores_df.columns = ['movieId', 'tagId', 'relevance']
        self.genome_scores_df = self.genome_scores_df.pivot(index='movieId', columns='tagId', values='relevance')

        # load all ratings
        self.ratings_df = pd.read_csv(ratings)

        print("Preprocessing data: movies, ratings, genome-scores...")

        # this check is temporary work-around, all items in load_list have to be unique and
        # correct with this check

        # filter movies only under tag-genome df
        movies_with_tag_genome = self.genome_scores_df.index.values

        # filter-out movies with (no genres listed)
        no_genre_movies = self.movies_df[self.movies_df['genres'] == '(no genres listed)']['movieId'].unique()

        self.all_movie_ids = np.setdiff1d(movies_with_tag_genome, no_genre_movies)

        # store final list of movie ID's
        # udpate genome_scores_df, ratings_df and movies_df to only keep updated movie ID's
        self.ratings_df = self.ratings_df[self.ratings_df['movieId'].isin(self.all_movie_ids)]
        # self.genome_scores_df = self.genome_scores_df[self.genome_scores_df['movieId'].isin(self.all_movie_ids)]
        self.genome_scores_df = self.genome_scores_df.loc[self.all_movie_ids, :]
        self.movies_df = self.movies_df[self.movies_df['movieId'].isin(self.all_movie_ids)]

        # TODO choose movies only above threshold_rating
        #  not necessary as below like threshold movies will be moved at the bottom by the reranking
        #  algorithm
        load_map = {
            'movies': self.movies_df,
            'ratings': self.ratings_df,
            'genomes': self.genome_scores_df
        }

        # append all items from load list to output list in same sequence
        for item in load_list:
            output_list.append(load_map[item])

        # TODO - this is not actually deleting the original referenced object, just deleting the
        #  value of mapped item in the load_map
        # delete all unused items
        for item in difference_list:
            del load_map[item]

        return tuple(output_list)

    def load_and_process_user_data(self, dataset):
        print("\nLoading generated data: genre, genome-lemmatized, genome-full term vectors for users and movies...")

        if self.all_movie_ids is None:
            self.load_and_preprocess_data(dataset)

        movie_genre_binary_terms, movies_genome_term_vector, user_int_genre_terms, user_genre_binary_terms, user_lemmatized_genome_terms, user_full_genome_terms \
            = self.init_user_data_file_names(dataset)
        # TODO load

        print(
            "Preprocessing generated data: genre, genome-lemmatized, genome-full term vectors for users and movies...")

        self.movie_genre_binary_terms_df = pd.read_pickle(movie_genre_binary_terms, compression='bz2')
        self.user_int_genre_terms_df = pd.read_pickle(user_int_genre_terms, compression='bz2')
        self.user_lemmatized_genome_terms_df = pd.read_pickle(user_lemmatized_genome_terms,
                                                              compression='bz2')
        self.user_full_genome_terms_df = pd.read_pickle(user_full_genome_terms, compression='bz2')
        self.movies_lemmatized_genome_term_vector_df = pd.read_pickle(movies_genome_term_vector, compression='bz2')
        self.user_genre_binary_term_vector_df = pd.read_pickle(user_genre_binary_terms, compression='bz2')

        # filter movies
        self.movies_lemmatized_genome_term_vector_df = self.movies_lemmatized_genome_term_vector_df.loc[
                                                       self.all_movie_ids, :]
        # self.user_full_genome_terms_df = self.user_full_genome_terms_df.loc[self.all_movie_ids, :]
        self.movie_genre_binary_terms_df = self.movie_genre_binary_terms_df.loc[self.all_movie_ids, :]

        return self.movie_genre_binary_terms_df, self.movies_lemmatized_genome_term_vector_df, self.user_int_genre_terms_df, self.user_genre_binary_term_vector_df, self.user_lemmatized_genome_terms_df, self.user_full_genome_terms_df
