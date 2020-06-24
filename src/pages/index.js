import React from 'react';
import { connect } from 'dva';
import router from 'umi/router'
import styles from './index.css';
import Upload from '../components/Upload'
import { Form, Select, Divider, Checkbox } from 'antd';
import $ from 'jquery';
import _ from 'lodash'

const { Option } = Select;


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
		console.log($, _)
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
										{menu}
										<Divider style={{ margin: '2px 0' }} />
										<div onMouseDown={e => e.preventDefault()} style={{ padding: '4px 8px 8px 8px', cursor: 'pointer' }}>
											<Checkbox onChange={this.onChange}>全选</Checkbox>
										</div>
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





class IndexPage extends React.Component{
	hadnleSearch = () => {
		let values = this.searchForm.props.form.getFieldsValue()
		console.log(values, 'form values +++++++++')
	}
	handleLogin = () => {
		router.push('/login')
	}
	render(){
		console.log(process.env.MODE)
		// console.log($, '---$---')

		return (
			<div className={styles.normal}>
				<h1 className={styles.title}>Welcome</h1>
				<ul className={styles.list}>
					<Upload name="haha" />
					<button onClick={this.handleLogin}>去登录</button>
				</ul>
	
				<Search 
					wrappedComponentRef={inst => this.searchForm = inst}
				/>
				<button onClick={this.hadnleSearch}>搜索</button>
			</div>
		);
	}
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
