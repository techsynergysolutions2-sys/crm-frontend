import {
    HomeOutlined,
    FontColorsOutlined,
    UserOutlined,
    IssuesCloseOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    LockOutlined,
    LineChartOutlined,
    ShoppingCartOutlined,
    UnorderedListOutlined,
    CalendarOutlined,TeamOutlined,PartitionOutlined,SolutionOutlined,GroupOutlined,FolderOpenOutlined,SafetyOutlined,
    FontSizeOutlined,SnippetsOutlined,TagsOutlined
} from '@ant-design/icons';
import {Avatar } from 'antd';

import { getFirestore, collection, query, where, getDocs,addDoc,updateDoc,doc  } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import axios from 'axios';

const fnLogin = () => {

  var companyid = sessionStorage.getItem('companyid')
  var uid = sessionStorage.getItem('uid')
  var permissions = sessionStorage.getItem('permissions')
  var groupid = sessionStorage.getItem('groupid')

  if(uid == undefined || uid == null || uid == ''){
    return false
  }

  if(companyid == undefined || companyid == null || companyid == ''){
    return false
  }

  if(permissions == undefined || permissions == null || permissions == ''){
    return false
  }

  if(groupid == undefined || groupid == null || groupid == ''){
    return false
  }

  return true
  
}

 export const fnCheckExpiryDate = () =>{
  const expdate = sessionStorage.getItem('expirydate')
  const currdate = new Date().toISOString().slice(0, 16)

  const ms = new Date(expdate).getTime();
  const ms2 = new Date(currdate).getTime();

  const total =   ms - ms2

  if(total < 0 ){
    return true
  }else{
    //not expired
    return false
  }
}

// main color #1092a7

// Max allowed size: 5MB in bytes
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

// export const url = 'http://192.168.0.6:5000'
// export const url = 'http://ec2-13-60-191-59.eu-north-1.compute.amazonaws.com:5000'
export const url = 'https://app-ihcagnmida-uc.a.run.app'

export const amou = 4.99


export const Task_Workflow_Status = [
    {
        id: 1,
        title: 'Pending',
        color: '#3498db',
        perc: 0
    },
    {
        id: 2,
        title: 'In Progress',
        color: '#e67e22',
        perc: 25
    },
    {
        id: 3,
        title: 'Waiting for Response',
        color: '#f1c40f',
        perc: 50
    },
    {
        id: 4,
        title: 'Deferred',
        color: '#bdc3c7',
        perc: 25
    },
    {
        id: 5,
        title: 'Completed',
        color: '#2ecc71',
        perc: 100
    },
    {
        id: 6,
        title: 'Cancelled',
        color: '#e74c3c',
        perc: 0
    }
]

export const Project_Workflow_Status = [
    {
        id: 1,
        title: 'Planned',
        color: '#3498db',
        perc: 0
    },
    {
        id: 2,
        title: 'In Progress',
        color: '#e67e22',
        perc: 25
    },
    {
        id: 3,
        title: 'On Hold',
        color: '#f1c40f',
        perc: 25
    },
    {
        id: 4,
        title: 'Reviewing',
        color: '#1abc9c',
        perc: 75
    },
    {
        id: 5,
        title: 'Waiting for Approval',
        color: '#9b59b6',
        perc: 75
    },
    
    // {
    //     id: 6,
    //     title: 'Delayed',
    //     color: '#d35400'
    // },
    // {
    //     id: 7,
    //     title: 'Cancelled',
    //     color: '#e74c3c'
    // },
    {
        id: 6,
        title: 'Completed',
        color: '#2ecc71',
        perc: 100
    },
    
]

export const project_priority = [
    {
    value: 1,
    label: 'Low',
    },
    {
    value: 2,
    label: 'Medium',
    },
    {
    value: 3,
    label: 'High',
    },
]

export const task_priority = [
    {
      value: 1,
      label: 'Low',
    },
    {
      value: 2,
      label: 'Medium',
    },
    {
      value: 3,
      label: 'High',
    }
]

export const order_status = [
  {
    id: 1,
    label: 'Pending'
  },
  {
    id: 2,
    label: 'Processing'
  },
  {
    id: 3,
    label: 'Completed'
  },
  {
    id: 4,
    label: 'Cancelled'
  }
]

export const leave_status = [
  {
    id: 1,
    label: 'Pending'
  },
  {
    id: 2,
    label: 'Approved'
  },
  {
    id: 3,
    label: 'Rejected'
  }
]

export const leave_type = [
  {
    id: 1,
    label: 'Annual Leave'
  },
  {
    id: 2,
    label: 'Sick Leave'
  },
  {
    id: 3,
    label: 'Parental Leave'
  },
  {
    id: 4,
    label: 'Volunteer Leave'
  }
]

export const ticket_status = [
  {
    id: 1,
    label: 'Open'
  },
  {
    id: 2,
    label: 'Assigned'
  },
  {
    id: 3,
    label: 'On Hold'
  },
  {
    id: 4,
    label: 'On Hold'
  },
  {
    id: 5,
    label: 'Resolved'
  },
  {
    id: 4,
    label: 'Closed'
  },
]

export const ticket_priority = [
  {
    id: 1,
    label: 'Critical'
  },
  {
    id: 2,
    label: 'High'
  },
  {
    id: 3,
    label: 'Medium'
  },
  {
    id: 4,
    label: 'Low'
  }
]

export const pages = [
    {id: 1, title: 'Dashboard'},
    {id: 2, title: 'Sales'},
    {id: 3, title: 'Inventory'},
    {id: 4, title: 'Orders'},
    {id: 5, title: 'Analytics'},
    {id: 6, title: 'Tasks'},
    {id: 7, title: 'Projects'},
    {id: 8, title: 'Tickets'},
    {id: 9, title: 'Leave'},
    {id: 10, title: 'Employees'},
    {id: 11, title: 'Clients'},
    {id: 12, title: 'Administrator'},
    {id: 13, title: 'Departments'},
    {id: 14, title: 'Groups'},
    {id: 15, title: 'Permissions'},
    {id: 16, title: 'Company profile'}
]

function getItem(id,label, key, icon, children) {
    return {
      id,
      key,
      icon,
      children,
      label,
    };
}

export const fnConnectNavigation = (permissions) =>{

    const admin = [
      {
        id: 13,
        key: 'departments',
        label: 'Departments',
      },
      {
        id: 14,
        key: 'groups',
        label: 'Groups',
      },
      {
        id: 15,
        key: 'permissionslist',
        label: 'Permissions',
      },
      {
        id: 16,
        key: 'companyprofile',
        label: 'Company profile',
      },
    ]

    const sales = [
      {
        id: 3,
        key: 'inventory',
        label: 'Inventory'
      },
      {
        id: 4,
        key: 'orders',
        label: 'Orders'
      },
      {
        id: 5,
        key: 'analytics',
        label: 'Analytics'
      }
    ]

    var pages = [
      // getItem(1,'Dashboard', '/dashboard',<HomeOutlined /> ,),
      getItem(2,'Sales', '/inventory', <UnorderedListOutlined />,),
      getItem(3,'Orders', '/orders', <ShoppingCartOutlined />,),
      getItem(4,'Analytics', '/analytics', <LineChartOutlined />,),
      getItem(5,'Tasks', '/tasklist',<FontSizeOutlined />),
      getItem(6,'Projects', '/projects',<SnippetsOutlined /> ,),
      getItem(7,'Tickets', '/tickets',<TagsOutlined />),
      getItem(8,'Leave', '/leaves', <CalendarOutlined />),
      getItem(9,'Employees', '/employees', <TeamOutlined />),
      getItem(10,'Clients', '/clients', <SolutionOutlined />),
      // getItem(12,'Administrator', 'admin', <UserOutlined />, admin),
      getItem(11,'Departments', '/departments', <PartitionOutlined />,),
      getItem(12,'Permissions', '/permissionslist', <SafetyOutlined />,),
      getItem(13,'Company profile', '/companyprofile', <FolderOpenOutlined />,),
      getItem(14,'Groups', '/groups', <GroupOutlined />,),
      getItem(0,'Profile', '/profile', <Avatar size='default' src={sessionStorage.getItem('photourl')} />,),
      getItem(100,'Log out', '/login', <LockOutlined />)
    ]

    if(fnLogin() == false){
      window.location.replace("http://Ebencrm.com/login");
      return
    }

    if(fnCheckExpiryDate == true ){
      if(sessionStorage.getItem('grouptitle') == 'Administrator'){
          window.location.href = "http://Ebencrm.com/companyprofile";
      }else{
        window.location.replace("http://Ebencrm.com/login");
        return
      }
    }
  
    if(sessionStorage.getItem('grouptitle') != 'Administrator'){
      console.log('Check 1')
      let st = '' 
      st = sessionStorage.getItem('permissions')
      let arr = st.split(',').map(Number)
      console.log(arr)
      pages = pages.filter(page => arr.includes(page.id));
    }else if(sessionStorage.getItem('grouptitle') == 'Administrator'){
      console.log('Check 2')
      pages = pages
    }
    
    return pages
  
}

export const fnGetFunctionPermissions = (permissions) => {
  let res = false

}

export const fnStringToArray = (str) => {
  let st =""
  return st.split(',',)
}

export async function fnGetData(api,tablename, where, cols) {
  try {
    const response = await axios.post(`${url}/${api}`, {tablename: tablename, where: where, columns: cols, action: 'select' });
    return response.data;  // ✅ return the data
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;  // rethrow if you want caller to handle errors
  }
}

export async function fnGetDirectData(api,sql) {
  try {
    const response = await axios.post(`${url}/${api}`, {sql: sql, action: 'select' });
    return response.data;  // ✅ return the data
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;  // rethrow if you want caller to handle errors
  }
}

export async function fnCreateData(api,tablename, data,action) {
  try {
    const response = await axios.post(`${url}/${api}`, {tablename: tablename, data: data, action: action });
    return response.data;  // ✅ return the data
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;  // rethrow if you want caller to handle errors
  }
}

export async function fnUpateData(api,tablename, data,whereCondition,whereValues,action) {
  try {
    const response = await axios.post(`${url}/${api}`, {tablename: tablename, data: data, whereCondition: whereCondition,whereValues:whereValues, action: action });
    return response.data;  // ✅ return the data
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;  // rethrow if you want caller to handle errors
  }
}

export const fnDateFormater = (num) => {
  const date = new Date(num);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  var formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`;

  return formattedDate
}

export async function fnUploadFile(file, path = "uploads/") {
  return new Promise(async (resolve, reject) => {
    try {
      // Validation
      if (!file) return reject("No file provided.");
      if (!ALLOWED_TYPES.includes(file.type)) {
        return reject("Only images (PNG, JPG) and PDFs are allowed.");
      }
      if (file.size > MAX_FILE_SIZE) {
        return reject("File size must not exceed 5MB.");
      }

      const storage = getStorage();
      const fileRef = ref(storage, `${path}${Date.now()}_${file.name}`);

      // Upload
      await uploadBytes(fileRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(fileRef);
      resolve(downloadURL);
    } catch (error) {
      reject("Upload failed: " + error.message);
    }
  });
}

export const fnFileURls = async (files) =>{

  if(files.length == 0) return []

  let urls = []
  for(let i = 0; i < files.length; i++){
        let fl = await fnUploadFile(files[i])
        urls.push({url: fl, name:files[0].name})
  }
  return urls
}

export const fnFileURls2 = async (files) =>{

  if(files.length == 0) return []

  let urls = []
  for(let i = 0; i < files.length; i++){
        const rawFile = files[i].originFileObj;   // IMPORTANT
        if (!rawFile) continue;
        let fl = await fnUploadFile(rawFile)
        urls.push({url: fl, name:files[i].name})
  }
  return urls
}

export const fnUpdateUserLoginDetails = async (email,password) => {

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    if (email) {
      await updateEmail(user, email);
    }

    if (password) {
      await updatePassword(user, password);
    }

    return { success: true, message: "User details updated successfully" };

  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};











export async function fnGetFilteredData(collectionName, filters = []) {
  try {
    const db = getFirestore();
    const colRef = collection(db, collectionName);

    // Apply filters using `where`
    const constraints = filters.map(([field, op, value]) => where(field, op, value));
    const q = query(colRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return data;
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    return [];
  }
}

export const fnAddDocument = async (collectionName, data) => {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID:", docRef.id);
    fnUpdateDocumentOnAdd(collectionName,docRef.id,db)
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    return null;
  }
};

const fnUpdateDocumentOnAdd = async (collectionName, docId,db) => {
  var value = {id: docId}
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, value);
    console.log("Document updated successfully!");
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

export const fnFindAndUpdateDocumentWithMultipleFields = async (
  collectionName,
  filters,
  updatedData
) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, collectionName);

    // Build the query with multiple where clauses
    let q = query(colRef);
    for (const [field, value] of Object.entries(filters)) {
      q = query(q, where(field, "==", value));
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No matching documents found.");
      return null;
    }

    // Update the first matching document
    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, updatedData);
    console.log("Document updated with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error updating document:", error);
    return null;
  }
};

