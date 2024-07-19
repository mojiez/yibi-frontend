import {Button, Form, Select, Space, Upload, Input, message} from 'antd';
import React, {useState} from 'react';
import {UploadOutlined} from "@ant-design/icons";
import {genChartByAiUsingPost} from "@/services/yibi/chartController";
import ReactECharts from 'echarts-for-react';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

// const onFinish = (values: any) => {
//   console.log('Received values of form: ', values);
// };

const AddChart: React.FC = () => {
  const [option,setOption] = useState<any>();
  const onFinish =async (values: any) => {
    console.log('Received values of form: ', values);
    const params = {
      ...values,
      file:undefined,
    }
    // params: API.genChartByAIUsingPOSTParams,
    // body: {},
    // file?: File,
    // options?: { [key: string]: any },
    try {
      const res = await genChartByAiUsingPost(params,{},values.file.file.originFileObj);
      if (!res?.data) {
        message.error("分析失败,没有取得数据");
      }else {
        message.success("分析成功")
        // 解析成对象
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error("图表代码解析错误");
        }else {
          setOption(chartOption);
        }
      }
    }catch (e:any) {
      message.error("分析失败，调用鱼聪明错误",e.message);
    }
  };

  return (
    // 多行输入 下拉输入 文件上传
    <>
    <div className="add-Chart">
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          'input-number': 3,
          'checkbox-group': ['A', 'B'],
          rate: 3.5,
          'color-picker': null,
        }}
        style={{maxWidth: 600}}
      >
        <Form.Item
          name="goal"
          label="分析目标"
          rules={[{required: true, message: '请输入你的分析需求'}]}
        >
          <Input.TextArea showCount maxLength={100}/>
        </Form.Item>
        <Form.Item
          name="name"
          label="图表名称">
          <Input placeholder="请输入图表名称"/>
        </Form.Item>

        <Form.Item
          name="chartType"
          label="图表类型"
          hasFeedback
          rules={[{required: true, message: '请选择图表类型'}]}
        >
          <Select placeholder="请选择图表类型">
            <Option value="折线图">折线图</Option>
            <Option value="柱状图 ">柱状图</Option>
            <Option value="堆叠图 ">堆叠图</Option>
            <Option value="饼图 ">饼图</Option>
            <Option value="雷达图 ">雷达图</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="file"
          label="原始数据"
        >
          <Upload name="file">
            <Button icon={<UploadOutlined/>}>上传CSV文件</Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{span: 12, offset: 6}}>
          <Space>
            <Button type="primary" htmlType="submit">
              智能分析
            </Button>
            <Button htmlType="reset">重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
    <div>
      生成图表：
      {option && <ReactECharts option={option} />}
    </div>
    </>
  );

};
export default AddChart;
