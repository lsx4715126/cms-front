import React from 'react';
import { Form, Select, Divider, Checkbox } from 'antd';

const { Option } = Select;


// 全选
@Form.create()
class Search extends React.Component{
	onChange = (e) => {		
		// console.log(`checked = ${e.target.checked}`);
		if(e.target.checked){
			this.props.form.setFieldsValue({employeeIds: ['jack', 'lucy', 'Yiminghe']})
		}else{
			this.props.form.setFieldsValue({employeeIds: []})
		}
	}
	render(){
		let { form: { getFieldDecorator } } = this.props

		return (
			<Form className="search-form">
				<Form.Item label={'员工工号'}>
					{
						getFieldDecorator('employeeIds', {})(
							<Select 
								style={{ width: 120 }}
								mode="multiple"
								dropdownRender={menu => (
									<div>
										<div onMouseDown={e => e.preventDefault()} style={{ padding: '4px 8px 8px 8px', cursor: 'pointer' }}>
											<Checkbox onChange={this.onChange}>全选</Checkbox>
										</div>
										<Divider style={{ margin: '2px 0' }} />
										{menu}
									</div>
								)}
							>
								<Option value="jack">Jack</Option>
								<Option value="lucy">Lucy</Option>
								<Option value="Yiminghe">yiminghe</Option>
							</Select>
						)
					}
				</Form.Item>
			</Form>
		)
	}
}


export default Search