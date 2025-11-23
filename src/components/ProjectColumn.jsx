import React,{useEffect,useState} from 'react'
import {Divider , Button, Transfer ,Avatar,Col, Row,Typography,Badge,Input,Select,Flex,Tag   } from 'antd';

import ProjectCard from '../products/projects/components/ProjectCard';

function ProjectColumn({projects,status}) {

  const [newProjects, setNewProjects] = useState([])

  useEffect(() =>{
    const fnFilterProjects = () => {
      setNewProjects(projects.filter(itm => itm.status === status.id))
    }

    fnFilterProjects()

  },[])

  return (
    <Row style={{height: '87vh', width: '20%', borderRadius: 5,boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', padding: 10}}>
        <Row style={{paddingTop: 7, width: '100%', height: '5vh'}}>
          <Col span={20}><Typography style={{fontWeight: 500}}>{status?.title}</Typography></Col>
          <Col span={4}> <Typography style={{fontWeight: 500}}>{newProjects?.length}</Typography></Col>
        </Row>
        <Divider style={{marginTop: -15}}/>
        <Row style={{width: '100%', height: '77vh', marginTop: -30, overflowY: 'scroll',msOverflowStyle: 'none',scrollbarWidth: 'none'}}>
           <Flex vertical={true} wrap gap="middle" style={{width: '100%'}}>
              {newProjects?.map((item, index) => (
                <ProjectCard key={index} task={item}/>
              ))}
            </Flex>
        </Row>
    </Row>
  )
}

export default ProjectColumn