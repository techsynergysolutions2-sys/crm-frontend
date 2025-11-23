import React from 'react'
import {Col, Row,Typography} from 'antd';

function TaskCard({task}) {

  const fnViewTaskInfor = () => {
    console.log(task)
  }

  return (
    <Row style={{...styles.mainDiv, backgroundColor: `${task.status}`}} className='taskcard_mainDiv' onClick={fnViewTaskInfor}>
      <Col style={styles.conDiv}>
        <Row>
          <Col span={12}>
            <Typography style={styles.text}>Task: {task.title}</Typography>
          </Col>
          <Col span={12}>
          <Typography style={styles.text}>Due date: {task.duedate?.replace('T', ' ')}</Typography></Col>
        </Row>
        <Row>
          <Col span={12}>
            <Typography style={styles.text}>Project: {task.project}</Typography>
          </Col>
          <Col span={12} style={{display: 'flex', flexDirection: 'row'}}>
            <Typography style={styles.text}>Priority</Typography> <PrioritySpan priorityColor={task.priority} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Typography style={styles.text}>Created by: {task.createdby}</Typography>
          </Col>
          <Col span={12}>
          <Typography style={styles.text}>Date: {task.createddate}</Typography></Col>
        </Row>
      </Col>
    </Row>
  )
}

function PrioritySpan({priorityColor}){
  return (
    <div style={{width: 10, height: 10, borderRadius: '50%', background: `${priorityColor}`, marginTop: 6, marginLeft: 3}}></div>
  )
}

const styles = {
  mainDiv: {
    width: '32%', 
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
    padding: 10
  },
  text: {
    fontSize: '13px'
  }
};

export default TaskCard

