import { useState, useEffect } from "react";
import { FloatButton, Tooltip,Avatar,Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {useNavigate } from 'react-router-dom'
import { fnGetDirectData,Project_Workflow_Status } from '../../shared/shared';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const { Option } = Select;

function ProjectCard({ project }) {

  const [status, setStatus] = useState(null)
  const [perc, setPerc] = useState(0)

  const navigate = useNavigate()

  const fnNavProject = (record) => {
    navigate("/project",{
      state: record
    })
    
  }

  useEffect(() =>{
    const fetchClients = () => {
      const data4 = Project_Workflow_Status.filter(itm => itm.id === project.status)
      setStatus(data4[0])

      if(project.tasks.length > 0){
        let temp = project.tasks.filter((itm) => itm.status == 5)
        let calc = (temp.length / project.tasks.length) * 100
        
        setPerc(parseInt(calc))
      }else{
        setPerc(0)
      }
    };
    
        fetchClients();
  },[project])

  return (
    <div className="card project-card" onClick={() => fnNavProject(project)}>
      <span className={`status`} style={{background: `${status?.color}`, color: '#fff'}}>{status?.title}</span>
      <h2 className="card-title">{project.title}</h2>
      <p className="card-meta">{project.notes}</p>
      <div className="card-details">
        <p><strong>Created:</strong> {project['createddate']?.replace('T', ' ')}</p>
        <p><strong>Due:</strong> {project['duration']?.replace('T', ' ')}</p>
        <p><strong>Created by:</strong> {project.full_name}</p>
        <p><strong>Client:</strong> {project.clientname}</p>
        <p><strong>Assigned to:</strong> {project.project_leader}</p>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${perc}%` }}></div>
      </div>
      <div className="team">
        {
          project.invites.length > 0 ? (
            project.invites.map((itm, i) => <MemberCard key={i} itm={itm} />)
          ):(null)
        }
      </div>
    </div>
  );
}

function MemberCard({itm }) {
  return (
    <Tooltip placement="top" title={`${itm.firstname} ${itm.lastname}`}>
      <Avatar src={itm.photourl} />
    </Tooltip>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState(0);
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredProjects, setFilteredProjects] = useState([])

  const navigate = useNavigate()

  const fnNavProject = (record) => {
    navigate("/project",{
      state: record
    })
  }

  useEffect(() =>{
    const fetchClients = async () => {
      var companyid = sessionStorage.getItem('companyid')

      let sql = `
        SELECT 
          p.*,
          CONCAT(ec.firstname, ' ', ec.lastname) AS full_name,
          CONCAT(el.firstname, ' ', el.lastname) AS project_leader,
          c.clientname,
          pn.notes,
          COALESCE(invites.invites, JSON_ARRAY()) AS invites,
          COALESCE(tasks.tasks, JSON_ARRAY()) AS tasks
        FROM projects p
        LEFT JOIN employees ec ON p.createdby = ec.id
        LEFT JOIN employees el ON p.leader = el.id
        LEFT JOIN clients c ON p.client = c.id
        LEFT JOIN project_notes pn ON p.id = pn.id

        -- Aggregate invites separately
        LEFT JOIN (
          SELECT 
            pi.projectid,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', pi.id,
                'firstname', e.firstname,
                'lastname', e.lastname,
                'full_name', CONCAT(e.firstname, ' ', e.lastname),
                'phone', e.phone,
                'email', e.email,
                'photourl', e.photourl
              )
            ) AS invites
          FROM project_invites pi
          LEFT JOIN employees e ON pi.userid = e.id
          WHERE pi.isactive = 1
          GROUP BY pi.projectid
        ) invites ON invites.projectid = p.id

        -- Aggregate tasks separately
        LEFT JOIN (
          SELECT 
            t.project,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', t.id,
                'title', t.title,
                'status', t.status,
                'photourl', e.photourl,
                'fullname', CONCAT(e.firstname, ' ', e.lastname)
              )
            ) AS tasks
          FROM tasks t
          LEFT JOIN employees e ON t.assignto = e.id
          GROUP BY t.project
        ) tasks ON tasks.project = p.id

        WHERE p.companyid = ${companyid}
          AND p.isactive = 1
        GROUP BY p.id;

      `

      try {
        const data = await fnGetDirectData('projects',sql);
        setProjects(data);
        setFilteredProjects(data)
        setLoading(!loading)
      } catch (error) {
        console.log(error)
      }
    };
    
        fetchClients();
  },[])


  const handleClose = () => {
    setLoading(!loading)
  };

  const fnFilterProjects = async (e) =>{
   
    if(e == 0){
      setFilteredProjects(projects)
    }else{
      let temp = projects.filter(p => p.status == e)
      setFilteredProjects(temp)
    }

  }

  return (
    <div className="crm-container">
      {/* Header with Filter */}
      <header className="header">
        <h1>Projects</h1>
        <div className="filters">
          <label htmlFor="statusFilter">Filter:</label>
          <Select style={{ width: 200 }} defaultValue={filter} placeholder="Please select a client" onChange={e => fnFilterProjects(e)}> 
            <Option value={0}>All</Option>
            { 
              Project_Workflow_Status?.map((itm,key) => (
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
        {filteredProjects.map((project,idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
        {filteredProjects.length === 0 && (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#6b7280" }}>
            No projects found.
          </p>
        )}
      </main>
      <>
        <FloatButton onClick={() => fnNavProject({})} shape="circle" type="primary" style={{ insetInlineEnd: 24 }} icon={<Tooltip placement="top" title={'New project'}><PlusOutlined /></Tooltip>} />
      </>
    </div>
  );
}
