let contacts = [];  // global

async function fetchContactList(){
    try{

        // const response = await fetch('http://localhost:3000/contacts')               
        //          const contacts = await response.json()
        //          console.log(contacts);
        //          displayList(contacts)

         const response = await fetch('../db.json')              
                  contacts = await response.json()
                  contacts = contacts['contacts']
                  displayList(contacts)
    }catch(error){
        console.error('Failed to fetch contacts:', error);
    }
}
fetchContactList();

function displayList(contacts){

    const contactList = document.getElementById('contactList')
    contactList.innerHTML = ''; // clear existing rows first

   if( contacts.length>0){

       contacts.forEach((contact,i)=>{
           const tr =document.createElement('tr')
           tr.innerHTML= `
                           <th scope="row">${i+1}</th>
                           <td> ${contact.name} </td>
                           <td> ${contact.phone} </td> 
                           <td class="text-center">
                               <a href="" class="delete-btn"  data-id="${contact.id}"><i class="bi bi-trash-fill me-3 text-danger" ></i></a>
                               <a  href="" class="edit-btn" data-id="${contact.id}" ><i class="bi bi-pencil-square" ></i> </a>
                           </td> 
                       `
           contactList.appendChild(tr)    
       })
   }
   
    totalCount(contacts) 
    
}

function totalCount(arr){
   
    let tableSection = document.getElementById('tableSection')
    let noData =document.getElementById('noData')
    if (arr.length > 0) {
       
        tableSection.classList.remove('d-none');
        if(!noData.classList.contains('d-none')){
            noData.classList.add('d-none');
        }
          

        // updating the count
        document.getElementById('totalCount').textContent = arr.length;
    }else{       
        
        tableSection.classList.add('d-none')
        noData.classList.remove('d-none');
    }
}

const addBtn =document.getElementById('addBtn')
const uname =document.getElementById('uname')
const phoneNo =document.getElementById('phoneNo')



const form = document.getElementById('addform');
form.addEventListener('submit', function(e) {
    e.preventDefault();  // prevent refresh

  
   const isNameValid = nameValidation(uname);
    const isPhoneValid = phnValidation(phoneNo);

    if (isNameValid && isPhoneValid) {
        addContact();
    }
      

});

// validation
function nameValidation(name){
     name = name.value.trim();
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
        alert('Name should contain only letters and spaces, no special characters.');
        uname.focus();
        return false;
    }
      return true; // valid
}
function phnValidation(phone){
     // Validate phone: 8-12 digits only
       phone = phone.value.trim();
    const phoneRegex = /^\d{8,12}$/;
    if (!phoneRegex.test(phone)) {
        alert('Phone number must be 8 to 12 digits.');
        phoneNo.focus();
        return false;
    }
      return true; // valid
}


function addContact(){
     const id =  Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
     const obj ={
        id:id,
        name:uname.value,
        phone:phoneNo.value

     }
   contacts.push(obj)
   displayList(contacts);
    uname.value = '';
    phoneNo.value = '';
   
}


document.getElementById('contactList').addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    const editBtn = e.target.closest('.edit-btn');
    const row = e.target.closest('tr');
    
    e.preventDefault();


    //dlete
   if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        contacts = contacts.filter(contact => contact.id !== id);
        displayList(contacts);
        totalCount(contacts)
    }

    

     //updating stage
     else if(editBtn && editBtn.classList.contains('updating')){
        const id = editBtn.getAttribute('data-id');        
        const nameInput = row.querySelector('.edit-name');
        const phoneInput = row.querySelector('.edit-phone');
        const newName = nameInput.value.trim();
        const newPhone = phoneInput.value.trim();


        // Simple validation
        
        const isNameValid = nameValidation(nameInput);
        const isPhoneValid = phnValidation(phoneInput);
        if (isNameValid && isPhoneValid) {

            const contact = contacts.find(c => c.id === id);
            if(contact){
                contact.name = newName;
                contact.phone = newPhone;
            }
             displayList(contacts);
            console.log(newName,newPhone,11);
        }


     }
     //editing stage
    
    else if (editBtn) {
      
         const icon = editBtn.querySelector('i');
        icon.classList.remove('bi-pencil-square');
        icon.classList.add('bi-check-circle-fill', 'text-success');
        
        const nameCell = row.children[1];
        const phoneCell = row.children[2];

        // Store current values
        const currentName = nameCell.textContent.trim();
        const currentPhone = phoneCell.textContent.trim();

        // Replace with input boxes
        nameCell.innerHTML = `<input type="text" class="form-control edit-name w-75" value="${currentName}">`;
        phoneCell.innerHTML = `<input type="text" class="form-control edit-phone w-75" value="${currentPhone}">`;
        editBtn.classList.add('updating')    

        
     }

});

// search
let search =document.getElementById('search')
search.addEventListener('input',()=>{
    searchVal =search.value.trim().toLowerCase()
    if (searchVal) {
        // check if searchVal is digits only
        const isNumber = /^\d+$/.test(searchVal);
         let contactsArr;
        if (isNumber) {
            // search in phone
            contactsArr = contacts.filter(c =>c.phone.includes(searchVal));
        } else {
            // search in name
            contactsArr = contacts.filter(c =>c.name.toLowerCase().includes(searchVal));
        }
         displayList(contactsArr)
    }else{
        displayList(contacts)
    }
})








/* {
      "id": 1,
      "name": "Alice",
      "phone": "1234567890"
    },
    {
      "id": 2,
      "name": "Bob",
      "phone": "9876543210"
    },
    {
      "id": 3,
      "name": "Radhika",
      "phone": "8876543210"
    }*/

