import unittest
from datetime import datetime

"""
    测试mapper
"""

# 测试mapper
from backend.mapper.sepecial_period_data import query_data_between_times


class MyTestCase(unittest.TestCase):
    def test_get_period_data(self):
        # 例子：查询时间在'2016-04-11 00:00:00' '2016-04-11 00:00:02' 之间的数据
        start_time = '2016-04-11 07:00:00'
        end_time = '2016-04-11 07:10:00'

        # start_time = datetime(2016, 4, 11, 0, 0, 0)
        # end_time = datetime(2016, 4, 11, 0, 0, 2)

        result = query_data_between_times(start_time, end_time)

        print(len(result))


if __name__ == '__main__':
    unittest.main()
