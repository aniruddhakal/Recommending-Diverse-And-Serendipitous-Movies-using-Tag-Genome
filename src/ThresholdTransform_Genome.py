from DataLoaderPreprocessor import DataLoaderPreprocessor
import numpy as np
import pandas as pd

base_dir = '../../datasets/Movielens/'

ml20m = base_dir + 'ml-20m/'
serendipity2018 = base_dir + 'serendipity-sac2018/'

data_output_dir = 'output3/'


class ThresholdTransform:

    def __init__(self, dataset, quantile_threshold, target_genome_float_pickle,
                 target_genome_binary_pickle,
                 compression):
        self.dataset = dataset
        self.quantile_threshold = quantile_threshold
        self.target_genome_float_pickle = target_genome_float_pickle
        self.target_genome_binary_pickle = target_genome_binary_pickle
        self.compression = compression

    def load_and_transform_data(self):
        data_loader = DataLoaderPreprocessor(base_dir=base_dir, ml20m='ml-20m/',
                                             serendipity2018='serendipity-sac2018/')

        genome_scores_df = data_loader.load_and_preprocess_data(dataset, ['genomes'])[0]

        print("Transforming the data...")
        # values above or equal to the threshold
        all_truths_binary_df = genome_scores_df.ge(genome_scores_df.quantile(q=quantile_threshold),
                                                   axis=1)

        # update all below-threshold values to 0
        genome_scores_df[~all_truths_binary_df] = 0

        # save udpated float and binary genome-scores df
        genome_scores_df.to_pickle(self.target_genome_float_pickle, compression=compression)
        all_truths_binary_df.to_pickle(self.target_genome_binary_pickle, compression=compression)

        print(genome_scores_df.head())
        print(all_truths_binary_df.head())

        print("Transformation finished, check files at desired locations...")


def main(dataset, quantile_threshold, target_genome_float_pickle,
         target_genome_binary_pickle, compression='bz2'):
    transform = ThresholdTransform(dataset, quantile_threshold, target_genome_float_pickle,
                                   target_genome_binary_pickle, compression='bz2')

    transform.load_and_transform_data()


if __name__ == '__main__':
    # to use this class from here, or else pass below arguments from different program
    # dataset = 'ml20m'
    dataset = 'serendipity2018'

    if dataset is 'ml20m':
        output_dir = ml20m + data_output_dir
    else:
        output_dir = serendipity2018 + data_output_dir

    compression = 'bz2'

    # quantile_threshold = 0.70
    # thresholds = [0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6, 0.7]
    thresholds = [0.25, 0.4, 0.7]

    for quantile_threshold in thresholds:
        target_genome_float_pickle = output_dir + 'threshold_' + str(quantile_threshold) + \
                                     '_float_movie_genomes_' + compression
        target_genome_binary_pickle = output_dir + 'threshold_' + str(quantile_threshold) + \
                                      '_binary_movie_genomes_' + compression

        main(dataset, quantile_threshold, target_genome_float_pickle, target_genome_binary_pickle,
             compression)
