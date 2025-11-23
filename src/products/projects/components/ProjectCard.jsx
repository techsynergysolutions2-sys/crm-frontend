import React,{useState} from 'react'
import {Col, Row,Typography,Avatar,Tooltip,Popover,Radio  } from 'antd';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import {useNavigate } from 'react-router-dom'

 const style = {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
};

function ProjectCard({task}) {

     const navigate = useNavigate()
    
    const fnViewTaskInfor = () => {
        console.log(task)
    }

    const fnNavProject = () => {
      navigate("/project")
    }

  return (
    <Row style={{...styles.mainDiv, backgroundColor: `${task.priority}`}} className='taskcard_mainDiv' onClick={fnViewTaskInfor}>
        <Col style={styles.conDiv}>
            <Row>
                <Col span={20}>
                    <Typography style={styles.text}>Title: {task.title}</Typography>
                </Col>
                <Col span={4}>
                    <PrioritySpan priorityColor={task.priority} task={task} />
                </Col>
            </Row>
            <Row>
                <Col span={24} onClick={fnNavProject}>
                    <Typography style={styles.text}>Cliet: {task.project}</Typography>
                </Col>
            </Row>
            <Row>
                <Col span={24} onClick={fnNavProject}>
                    <Typography style={styles.text}>Due date: {task.duedate}</Typography>
                </Col>
            </Row>
            <Row>
                <Col span={24} onClick={fnNavProject}>
                    <Avatar.Group>
                        <Avatar size="small" src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                        <Tooltip title="K" placement="top">
                            <Avatar size="small" style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        </Tooltip>
                        <Tooltip title="Ant User" placement="top">
                            <Avatar size="small" style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                        </Tooltip>
                        <Avatar size="small" style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
                    </Avatar.Group>
                </Col>
            </Row>
        </Col>
    </Row>
  )
}

function PrioritySpan({priorityColor,task}){

     const [value, setValue] = useState(task?.status);
     const [isOpen, setIsOpen] = useState(false)

    const onChange = e => {
        setValue(e.target.value);
        fnChangeIsopen()
    };


     const content = (
        <Radio.Group
        style={style}
        onChange={onChange}
        value={value}
        options={[
            { value: 1, label: 'Planned' },
            { value: 2, label: 'In Progress' },
            { value: 3, label: 'On Hold' },
            { value: 4, label: 'Reviewing' },
            { value: 5, label: 'Waiting for Approval' },
            { value: 6, label: 'Completed' }
        ]}
        />
    );

    const fnChangeIsopen = () => {
        setIsOpen(!isOpen)
    }
    return (
        <Popover content={content} title={'test'} trigger="click" color='#f5f5f5' open={isOpen}>
            <Typography onClick={fnChangeIsopen}>
                <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: `${priorityColor}`, marginTop: 4, marginLeft: 3}}></div>
            </Typography>
        </Popover>
    )
  }
  
const styles = {
mainDiv: {
    width: '98%', 
    display: 'flex', 
    justifyContent: 'flex-end', 
    borderRadius: 9, 
    cursor: 'pointer',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
},
conDiv: {
    width: '97%', 
    background: '#fff', 
    borderRadius: 9,
    fontFamily: "'Poppins', sans-serif",
    paddingLeft: 5,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5
},
text: {
    fontSize: '11px'
}
};

export default ProjectCard