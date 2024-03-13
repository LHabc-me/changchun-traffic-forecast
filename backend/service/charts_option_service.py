from sqlalchemy import text

from dao.engine import Session
from service.direction_service import direction_service
from service.position_service import position_service
import pyecharts
from pyecharts import options as opts

from service.speed_service import speed_service


def speed_chart(timespan):
    session = Session()
    sql = text("""
        SELECT 
            to_char(ad."time", 'YYYY-MM-DD HH24') as dayhour,
            CAST(AVG(ad."speed") AS DECIMAL(10, 2)) AS avg_speed
        FROM 
            all_data ad
        WHERE 
                ad."time" BETWEEN :start_time AND :end_time
            AND 
                ad."speed" > 0
        GROUP BY 
            to_char(ad."time", 'YYYY-MM-DD HH24')
    """)
    query = session.execute(
        sql,
        {
            'start_time': timespan['from'],
            'end_time': timespan['to']
        }
    ).fetchall()
    session.close()
    data = []
    for i in query:
        data.append(i)

    chart = pyecharts.charts.Line()
    chart.add_xaxis([i[0] for i in data])
    chart.add_yaxis("平均速度", [i[1] for i in data])
    chart.set_global_opts(
        title_opts=opts.TitleOpts(title="行驶速度统计",
                                  pos_left="center"),
        legend_opts=opts.LegendOpts(pos_right="5%",
                                    pos_top="top",
                                    orient="vertical")
    )

    return chart


def direction_chart(timespan):
    session = Session()
    sql = """
        SELECT 
            CASE
                WHEN ad."direction" >= 337.5 OR ad."direction" < 22.5 THEN '北'
                WHEN ad."direction" >= 22.5 AND ad."direction" < 67.5 THEN '东北'
                WHEN ad."direction" >= 67.5 AND ad."direction" < 112.5 THEN '东'
                WHEN ad."direction" >= 112.5 AND ad."direction" < 157.5 THEN '东南'
                WHEN ad."direction" >= 157.5 AND ad."direction" < 202.5 THEN '南'
                WHEN ad."direction" >= 202.5 AND ad."direction" < 247.5 THEN '西南'
                WHEN ad."direction" >= 247.5 AND ad."direction" < 292.5 THEN '西'
                WHEN ad."direction" >= 292.5 AND ad."direction" < 337.5 THEN '西北'
            END AS dir,
            COUNT(*) AS count
        FROM 
            all_data ad
        WHERE
            ad."time" BETWEEN :start_time AND :end_time
        GROUP BY 
            dir
    """
    query = session.execute(
        text(sql),
        {
            'start_time': timespan['from'],
            'end_time': timespan['to']
        }
    ).fetchall()
    session.close()
    data = []
    for i in query:
        data.append([i[0], i[1]])
    # 按北、东北、东、东南、南、西南、西、西北排序
    data = sorted(data, key=lambda x: ['北', '东北', '东', '东南', '南', '西南', '西', '西北'].index(x[0]))

    # 生成饼图
    chart = pyecharts.charts.Pie()
    chart.add(
        "",
        data,
        rosetype="radius",
    )
    chart.set_series_opts(label_opts=opts.LabelOpts(formatter="{b}: {c} ({d}%)"))
    chart.set_global_opts(
        title_opts=opts.TitleOpts(title="行驶方向统计",
                                  pos_left="center",
                                  ),
        legend_opts=opts.LegendOpts(pos_right="5%",
                                    pos_top="top",
                                    orient="vertical")

    )
    return chart


def peak_area_chart(timespan):
    session = Session()
    sql = text("""
        SELECT 
            COUNT(*) AS count,
            l.name
        FROM all_data ad
        LEFT JOIN lines l 
        ON
                ad.ogc_fid = l.ogc_fid
            AND
                l.name IS NOT NULL
        WHERE 
                ad."time" BETWEEN :start_time AND :end_time
            AND 
                l.name IS NOT NULL
        GROUP BY ad.ogc_fid, l.name
        ORDER BY count DESC 
        LIMIT 10
    """)
    query = session.execute(
        sql,
        {
            'start_time': timespan['from'],
            'end_time': timespan['to']
        }
    ).fetchall()
    session.close()

    data = []
    for i in query:
        data.append(i)

    data = data[::-1]

    # 指定数据到坐标轴的映射
    # grid.containLabel = true
    chart = pyecharts.charts.Bar()
    chart.add_xaxis([i[1] for i in data])
    chart.add_yaxis("车辆数", [i[0] for i in data])
    chart.reversal_axis()

    chart.set_global_opts(
        title_opts=opts.TitleOpts(title="高峰区域统计",
                                  pos_left="center"),
        legend_opts=opts.LegendOpts(pos_right="5%",
                                    pos_top="top",
                                    orient="vertical"),

    )

    return chart


def peak_time_chart(timespan):
    # 按每天每小时统计车辆
    session = Session()
    sql = text("""
        SELECT COUNT(*) as count, dayhour
        FROM (
            SELECT 
                to_char(ad."time", 'YYYY-MM-DD HH24') as dayhour
            FROM all_data ad
            WHERE 
                    ad."time" BETWEEN :start_time AND :end_time
        ) as t
        GROUP BY dayhour
    """)
    query = session.execute(
        sql,
        {
            'start_time': timespan['from'],
            'end_time': timespan['to']
        }
    ).fetchall()
    session.close()
    data = []
    for i in query:
        data.append(i)

    # 生成柱状图
    chart = pyecharts.charts.Bar()
    chart.add_xaxis([i[1] for i in data])
    chart.add_yaxis("车辆数", [i[0] for i in data])

    chart.set_global_opts(
        title_opts=opts.TitleOpts(title="高峰时段统计",
                                  pos_left="center"),
        legend_opts=opts.LegendOpts(pos_right="20",
                                    pos_top="top",
                                    orient="vertical")
    )

    chart.set_series_opts(
        label_opts=opts.LabelOpts(is_show=False),
        markpoint_opts=opts.MarkPointOpts(
            data=[
                opts.MarkPointItem(type_="max", name="最大值", symbol_size=80),
                opts.MarkPointItem(type_="min", name="最小值", symbol_size=80),
            ]
        ),
    )

    # chart.overlap((
    #     pyecharts.charts.Line()
    #     .add_xaxis([i[1] for i in data])
    #     .add_yaxis("车辆数", [i[0] for i in data])
    #     .set_global_opts(
    #         title_opts=opts.TitleOpts(title="高峰时段统计",
    #                                   pos_left="center"),
    #         legend_opts=opts.LegendOpts(pos_right="20",
    #                                     pos_top="top",
    #                                     orient="vertical")
    #     )
    # ))
    return chart


def charts_option_service(timespan, chartsType):
    chart = None
    if chartsType == "行驶速度统计":
        chart = speed_chart(timespan)
    elif chartsType == "行驶方向统计":
        chart = direction_chart(timespan)
    elif chartsType == "高峰区域统计":
        chart = peak_area_chart(timespan)
    elif chartsType == "高峰时段统计":
        chart = peak_time_chart(timespan)

    if not chart:
        return None
    option = chart.dump_options()
    return option
