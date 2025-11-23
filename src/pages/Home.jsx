import React,{useState,useEffect} from 'react'
import {Layout, Button, Dropdown,Avatar,Col, Row,Typography,Badge } from 'antd';
import {AppstoreOutlined,UserOutlined,BellOutlined,MessageOutlined } from '@ant-design/icons';
import {useNavigate, Outlet } from 'react-router-dom'
import {onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import {auth, db} from '../shared/firebase'
// import { fnLogin } from '../shared/shared';

import SidebarMenu from '../components/SidebarMenu';

const { Header, Content } = Layout;

const items = [
    {
      key: '1',
      label: (
        <a href="/crm">
          CRM
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a href="/projects">
          Projects
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          Sales
        </a>
      ),
    },
    {
      key: '4',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          TimeSheet
        </a>
      ),
    },
    {
        key: '5',
        label: (
          <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
            Clients
          </a>
        ),
      },
  ];

function Home() {

  const navigate = useNavigate();
  const [userInfor, setUserInfor] = useState(null)

  useEffect(() => {

    // console.log('************************')
    // console.log(fnLogin())
    // console.log('***************************')
    // if(fnLogin() == false){
    //   // window.location.replace("http://localhost:3000/login");
    // }

    const fnGetUserInfor = () => {
      onAuthStateChanged(auth,(user) => {
        if (user) {
          console.log(user)
          setUserInfor(user)
        } else {
          navigate('/login')
          // User is signed out
          // ...
        }
      });
    }

    fnGetUserInfor()
    console.log(userInfor)
  },[])

  return (
 <Layout style={{height: '100vh'}}>
    <SidebarMenu collapse={false} />
    <Layout>
         {/* <Header style={{backgroundColor: '#fff',boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' ,height: 50, paddingLeft: '8px', paddingRight: '8px', position: 'sticky', top: 0, zIndex: 500}}>
             <Row style={{ flex: 1}}>
                 <Col span={24}><Typography style={{...Styles,float: 'right', marginRight: 5, fontWeight: 500, color: 'black', marginTop: 5}}>
                     <Badge count={2} style={{marginRight: '40px',fontSize:'12px', marginTop: '3px'}} color='green'>
                         <MessageOutlined style={{fontSize: '20px', color: 'black',marginRight: '40px'}}/>
                     </Badge>
                     <Badge count={5} style={{marginRight: '40px',fontSize:'12px', marginTop: '3px'}} color='green'>
                         <BellOutlined style={{fontSize: '20px', color: 'black',marginRight: '40px'}}/>
                     </Badge>
                     {userInfor?.displayName} <Avatar size='large' icon={<UserOutlined />} /></Typography>
                 </Col>
             </Row>
         </Header> */}

         <Content>
            
          <Outlet />

         </Content>
        </Layout>
    </Layout>
  )
}

const Styles = {
    btn: {
        marginLeft: 10,
        marginTop: '-10px'
    },
    text: {
      fontFamily: "'Poppins', sans-serif",
    }
  }

export default Home