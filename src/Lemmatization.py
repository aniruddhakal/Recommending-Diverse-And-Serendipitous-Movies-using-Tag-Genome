import numpy as np
import pandas as pd
import re
import matplotlib.pyplot as plt

data_base_dir = '../../datasets/Movielens/'
data_dir2 = data_base_dir + 'Movielens Latest/ml-latest/'
data_dir = data_base_dir + 'ml-20m/'

genome_scores = data_dir + 'genome-scores.csv'
genome_tags = data_dir + 'genome-tags.csv'
movies = data_dir + 'movies.csv'
ratings = data_dir + 'ratings.csv'
tags = data_dir + 'tags.csv'

import nltk
from nltk.stem import WordNetLemmatizer


def main():
    genome_tags_df = pd.read_csv(genome_tags)
    genome_tags_df.set_index(genome_tags_df['tagId'].values, drop=True, inplace=True)
    genome_tags_df.drop(labels='tagId', axis=1, inplace=True)




if __name__ == '__main__':
    main()
