import pandas as pd

class DataLoader():
    def defect_exclusion(self, rows):
        ret = []

        for row in rows:
            row = row.split(',')

            if len(row) != 4:
                continue

            if '※' in row:
                continue

            ret.append(row)
        return ret

    def load_txt(self, fn):
        with open(fn, 'r', encoding='utf-8') as f:
            return f.read().splitlines()

    def load_csv(self, data):
        return pd.DataFrame(data=data[1:], columns=data[0])


class Preprocessor:
    def __init__(self, df):
        self.df = df
    
    def drop_duplicates(self):
        return self.df.drop_duplicates()

    def drop_column_duplicates(self, column):
        return self.df[column].drop_duplicates()


if __name__ == '__main__':
    loader = DataLoader()
    
    txtlines = loader.load_txt('beatmania.txt')
    data = loader.defect_exclusion(txtlines)
    df = loader.load_csv(data)

    processor = Preprocessor(df)

    uniq_df = processor.drop_duplicates()
    
    with open('uniq_genre.txt', 'w', encoding='utf-8') as f:
        genres = processor.drop_column_duplicates('genre').sort_values().values.tolist()
        f.write('\n'.join(genres))

    with open('uniq_vector.txt', 'w', encoding='utf-8') as f:
        text_datalist = [','.join([str(elm) for elm in data]) for data in uniq_df.values.tolist()]
        f.write(','.join(uniq_df.columns) + '\n')
        f.write('\n'.join(text_datalist))