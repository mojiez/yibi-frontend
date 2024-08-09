import {genChartByAiAsyncUsingPost, genChartByAiUsingPost} from '@/services/yibi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';
import {useForm} from "antd/es/form/Form";


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

// const onFinish = (values: any) => {
//   console.log('Received values of form: ', values);
// };

const AddChartAsync: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();
  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    if (submitting) {
      // 如果说正在加载 直接返回 避免重复请求
      return;
    }
    // 如果之前 没有加载 现在点击了提交 那就要设置为正在加载
    setSubmitting(true);
    const params = {
      ...values,
      file: undefined,
    };
    // params: API.genChartByAIUsingPOSTParams,
    // body: {},
    // file?: File,
    // options?: { [key: string]: any },
    try {
      // const res = await genChartByAiUsingPost(params, {}, values.file.file.originFileObj);
      const res  = await genChartByAiAsyncUsingPost(params, {},  values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败,没有取得数据');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表页面查看');
        // 重置所有字段
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败，调用鱼聪明错误', e.message);
    }
    // 请求完以后 加载完成
    setSubmitting(false);
  };

  return (
    // 多行输入 下拉输入 文件上传
    <div className="add-Chart-async">
          <Form
            form={form}
            name="validate_other"
            {...formItemLayout}
            onFinish={onFinish}
            initialValues={{
              'input-number': 3,
              'checkbox-group': ['A', 'B'],
              rate: 3.5,
              'color-picker': null,
            }}
            // style={{ maxWidth: 600 }}
          >
            <Form.Item
              name="goal"
              label="分析目标"
              rules={[{ required: true, message: '请输入你的分析需求' }]}
            >
              <Input.TextArea showCount maxLength={100} />
            </Form.Item>
            <Form.Item name="name" label="图表名称">
              <Input placeholder="请输入图表名称" />
            </Form.Item>

            <Form.Item
              name="chartType"
              label="图表类型"
              hasFeedback
              rules={[{ required: true, message: '请选择图表类型' }]}
            >
              <Select placeholder="请选择图表类型">
                <Option value="折线图">折线图</Option>
                <Option value="柱状图 ">柱状图</Option>
                <Option value="堆叠图 ">堆叠图</Option>
                <Option value="饼图 ">饼图</Option>
                <Option value="雷达图 ">雷达图</Option>
              </Select>
            </Form.Item>

            <Form.Item name="file" label="原始数据">
              <Upload name="file">
                <Button icon={<UploadOutlined />}>上传CSV文件</Button>
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                  智能分析
                </Button>
                <Button htmlType="reset" loading={submitting} disabled={submitting}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>

      {/*生成图表：*/}
      {/*{option && <ReactECharts option={option} />}*/}
    </div>
  );
};
export default AddChartAsync;
