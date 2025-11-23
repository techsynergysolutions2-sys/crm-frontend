import {useState, useEffect} from 'react'
// import '../customstyles/customstyle.css';
import { Layout, Menu,Row,Col,Image, Typography } from 'antd';
import {useNavigate} from 'react-router-dom'
import { fnConnectNavigation } from '../shared/shared';

const { Sider } = Layout;


function SidebarMenu({collapse}) {

  const navigate = useNavigate()

  const [profile, setProfile] = useState('')

  useEffect(() => {

    setProfile(sessionStorage.getItem('photourl'))
    
  },[])

  const onClick = (e) => {
    navigate(e)
  };

  const fnNavProfile = () => {
    navigate('/Profile')
  }

  return (
    <>
    
      <Sider trigger={null} collapsed={collapse} style={{backgroundColor: '#fff',overflowY: 'scroll',msOverflowStyle: 'none',scrollbarWidth: 'none'}}>
        <div className="demo-logo-vertical" />

        <Menu onClick={({key}) => onClick(key) } theme="light" defaultOpenKeys={['sales','admin']} defaultSelectedKeys={['1']} mode="inline" items={fnConnectNavigation([])} 
        style={{fontSize: "17px"}} />
        
      </Sider>

    </>
  
  )
}

export default SidebarMenu