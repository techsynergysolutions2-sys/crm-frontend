import './App.css';
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import '@ant-design/v5-patch-for-react-19';
import './css/custom.css'

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
// import Crm from './products/crm/Crm';
import Projects from './products/projects/Projects'
import Task from './products/crm/Task'
import Project from './products/projects/ProjectInfor';
import Employees from './products/employees/Employees';
import Employee from './products/employees/Employee';
import Department from './products/department/Department';
import Departments from './products/department/Departments';
import Clients from './products/clients/Clients';
import Client from './products/clients/Client';
import Tasks from './products/crm/Tasklist';
import Inventory from './products/inventory/Inventory';
import Product from './products/inventory/Product';
import Orders from './products/orders/Orders';
import CreateOrder from './products/orders/NewOrder';
import Invoice from './products/orders/Invoice';
import Leaves from './products/leave/Leaves';
import EmployeeLeaveForm from './products/leave/LeaveForm';
import CompanyProfile from './products/company/CompanyProfile';
import PermissionsList from './products/permissions/PermissionsList';
import PermissionsTab from './products/permissions/Permissions';
import Groups from './products/groups/Groups';
import Group from './products/groups/Group';
import Tickets from './products/tickets/Tickets';
import Ticket from './products/tickets/Ticket';
import Analytics from './products/analytics/Analytics';
import Profile from './products/profile/Profile';
// import Dashboard from './products/dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route Component={Login} path="/login"/>
          <Route Component={Register} path="/register"/>
          <Route Component={Home} path="/">
            <Route Component={Tasks} path="/tasklist"/>
            <Route Component={Task} path="/task"/>
            <Route Component={Projects} path="/projects"/>
            <Route Component={Project} path="/project"/>
            <Route Component={Inventory} path="/inventory"/>
            <Route Component={Product} path="/product"/>
            <Route Component={Orders} path="/orders"/>
            <Route Component={CreateOrder} path="/neworder"/>
            <Route Component={Analytics} path="/analytics"/>
            <Route Component={Employees} path="/employees"/>
            <Route Component={Employee} path="/employee"/>
            <Route Component={Departments} path="/departments"/>
            <Route Component={Department} path="/department"/>
            <Route Component={PermissionsList} path="/permissionslist"/>
            <Route Component={PermissionsTab} path="/permissions"/>
            <Route Component={Clients} path="/clients"/>
            <Route Component={Client} path="/client"/>
            <Route Component={Leaves} path="/leaves"/>
            <Route Component={EmployeeLeaveForm} path="/leaveform"/>
            <Route Component={CompanyProfile} path="/companyprofile"/>
            <Route Component={Groups} path="/groups"/>
            <Route Component={Group} path="/group"/>
            <Route Component={Tickets} path="/tickets"/>
            <Route Component={Ticket} path="/ticket"/>
            <Route Component={Profile} path="/profile"/>
            {/* <Route Component={Dashboard} path="/dashboard"/> */}
          </Route>
          <Route Component={Invoice} path="/invoice"/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
