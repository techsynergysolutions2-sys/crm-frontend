import React, { useState, useEffect } from "react";
import { FloatButton, Tooltip,Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {useNavigate } from 'react-router-dom'
import { fnGetFilteredData,Task_Workflow_Status,fnGetDirectData } from '../../shared/shared';
import { getAuth } from "firebase/auth";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const { Option } = Select;

function TaskCard({ task }) {

  const [status, setStatus] = useState(null)

  const navigate = useNavigate()

  const fnNavTask = (record) => {
    navigate("/task",{
      state: record
    })
  }

  useEffect(() =>{
    const fetchClients = async () => {

      const data4 = Task_Workflow_Status.filter(itm => itm.id === task.status)
      setStatus(data4[0])
    };
    
        fetchClients();
  },[task])

  return (

    <div className="card" onClick={() => fnNavTask(task)}>
      <h2 className="card-title">{task.tasttitle}</h2>
      <p className="card-meta">
        Project: {task.title}
      </p>
      <p className="card-meta">
        Due: {task.duedate?.replace('T', ' ')} • Created by: {task.created_by}
      </p>
      <span className={`status`} style={{background: `${status?.color}`, color: '#fff'}}>{status?.title}</span>
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredTask, setFilteredTask] = useState([])

  const navigate = useNavigate()

  const fnNavTask = (record) => {
    navigate("/task",{
      state: record
    })
  }

  useEffect(() =>{
    const fetchClients = async () => {
      var companyid = sessionStorage.getItem('companyid')
      var uid = sessionStorage.getItem('uid')
      let sql = `
            SELECT t.*,CONCAT(e.firstname, ' ', e.lastname) AS created_by,
            p.title,CONCAT(ea.firstname, ' ', ea.lastname) AS assign_to,
            td.description,t.title As tasttitle,
            COALESCE(notes.notes, JSON_ARRAY()) AS notes
            FROM tasks t 
            LEFT JOIN projects p ON t.project = p.id
            LEFT JOIN employees e ON t.createdby = e.id
            LEFT JOIN employees ea ON t.assignto = ea.id
            LEFT JOIN task_descriptions td ON t.id = td.taskid

            LEFT JOIN (
              SELECT 
                tn.id,tn.taskid,
                JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'idn', tn.id,
                    'notes', tn.notes,
                    'taskid', tn.taskid
                  )
                ) AS notes
              FROM tasks tl
              LEFT JOIN task_notes tn ON tl.id = tn.taskid
              WHERE tl.isactive = 1
              GROUP BY tl.id
            ) notes ON notes.taskid = t.id

            WHERE t.companyid = ${companyid} AND t.assignto = ${uid} AND t.isactive = 1
            GROUP BY t.id;
            `
      
      try {
        const data = await fnGetDirectData('tasks',sql);
        setTasks(data);
        setFilteredTask(data)
        setLoading(!loading)
      } catch (error) {
        // console.log(error)
      }
    };
    
    fetchClients();
  },[])

  const fnFilterTasks = async (e) =>{
   
    if(e == 0){
      setFilteredTask(tasks)
    }else{
      let temp = tasks.filter(p => p.status == e)
      setFilteredTask(temp)
    }

  }

  const handleClose = () => {
    setLoading(!loading)
  };

  return (
    <div className="crm-container">
      {/* Header with Filter */}
      <header className="header">
        <h1>Tasks</h1>
        <div className="filters">
          <label htmlFor="statusFilter">Filter:</label>
          <Select style={{ width: 200 }} defaultValue={0} placeholder="Please select a client" onChange={e => fnFilterTasks(e)}> 
            <Option value={0}>All</Option>
            { 
              Task_Workflow_Status?.map((itm,key) => (
                <Option key={itm.id} value={itm.id}>{itm.title}</Option>
              ))
            }
          </Select>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="grid">
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {filteredTask.map((itm,idx) => (
          <TaskCard key={idx} task={itm} />
        ))}
        {filteredTask.length === 0 && (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#6b7280" }}>
            No projects found.
          </p>
        )}
      </main>
      <>
        <FloatButton onClick={() => fnNavTask({})} shape="circle" type="primary" style={{ insetInlineEnd: 24 }} icon={<Tooltip placement="top" title={'New project'}><PlusOutlined /></Tooltip>} />
      </>
    </div>
  );
}
