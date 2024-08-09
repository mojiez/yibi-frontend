import { listMyChartVoByPageUsingPost } from '@/services/yibi/chartController';
import { useModel } from '@umijs/max';
import {Avatar, Card, List, message, Result} from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

// const onFinish = (values: any) => {
//   console.log('Received values of form: ', values);
// };

const MyChart: React.FC = () => {
  // 获取原始数据
  const initSearchParams = {
    // 初始情况下返回每页12条数据
    pageSize: 4,
    current: 1,
    // 按创建时间排序
    sortField: 'createTime',
    // 降序
    sortOrder: 'desc',
  };
  // 定义发送给后端的查询条件
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const [chartList, setChartList] = useState<API.Chart[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setloading] = useState<boolean>(false);
  // 从全局状态中获取到当前登陆的用户信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  // 定义一个获取数据的异步函数
  const loadData = async () => {
    //调用后端的接口
    setloading(true);
    try {
      const res = await listMyChartVoByPageUsingPost(searchParams);
      if (res.data) {
        // records里面是分页
        setChartList(res.data.records ?? []);
        // 获取数据的总条数
        setTotal(res.data.total ?? 0);
      } else {
        // data为空 返回的数据为空
        message.error('data为空');
        throw new Error('data为空');
      }
    } catch (e) {
      message.error('获取Chart失败', e.message);
    }
    setloading(false);
  };

  // 首次页面加载时，触发加载数据,当searchParams改变时，也触发加载数据
  useEffect(() => {
    loadData();
  }, [searchParams]);
  return (
    <div className="my-chart">
      <div className="margin-16">
        <Search
          placeholder="请输入图表名称"
          enterButton
          loading={loading}
          onSearch={(value) => {
            // 设置搜索条件
            setSearchParams({
              // 搜索条件
              ...searchParams,
              // 搜索词
              name: value,
            });
          }}
        />
      </div>
      <List
        size="large"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page) => {
            console.log(page);
            setSearchParams({
              ...searchParams,
              current: page,
            });
          },
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        footer={
          <div>
            <b>yibi</b> my-chart
          </div>
        }
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card>
              <List.Item.Meta
                // 用户信息 头像之类已经知道的先展示出来
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型 ' + item.chartType : undefined}
              />
              {
                item.status === 'failed' &&
                <>
                  <Result
                    status="error"
                    title="图表生成失败"
                    subTitle={item.execMessage}
                  >
                  </Result>
                </>
              }
              {
                item.status === 'running' &&
                <>
                  <Result
                    status="warning"
                    title="正在分析图表数据"
                    subTitle={item.execMessage}
                  >
                  </Result>
                </>
              }
              {
                item.status === 'wait' &&
                <>
                  <Result
                    status="info"
                    title="等待数据处理"
                    subTitle={item.execMessage}
                  >
                  </Result>
                </>
              }
              {
                item.status === 'succeed' &&
              <>
                {item.genResult}
                {<ReactECharts option={JSON.parse(item.genChart)} />}
              </>
              }
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChart;
