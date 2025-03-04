//navigation
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownContent = document.querySelector('.dropdown-content');
//login-dropdown
const dropdownLogin = document.querySelector('.dropdown-login');
const loginButton = document.getElementById('login-button');
//news-form
const togglenewsForm = document.getElementById('togglenewsForm');
const togglenewsFormP = document.getElementById('togglenewsFormP');
const togglenewsFormE = document.getElementById('togglenewsFormE');
const togglenewsFormM = document.getElementById('togglenewsFormM');
const newsForm = document.getElementById('newsForm');
const overlay = document.querySelector('.overlay');
const cancelNewsButton = document.getElementById('cancel-news');
//register-loginForms
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
//userdetails-logout
const logoutButton = document.getElementById('logoutButton');
const userNameDisplay = document.getElementById('userNameDisplay');
//hiddenaccess
const PoliceHQLink = document.querySelector('a[href="PoliceOnly.html"]');
const EMSHQLink = document.querySelector('a[href="EMSOnly.html"]');
const MechanicsHQLink = document.querySelector('a[href="MechanicsOnly.html"]');
//news
const NewsMainGrid = document.querySelector("[news-main-grid]");
const NewsMainTemplate = document.querySelector("[news-main-template]");
const NewsMainForm = document.getElementById('newsMainForm');

const NewsPoliceGrid = document.querySelector("[news-police-grid]");
const NewsPoliceTemplate = document.querySelector("[news-police-template]");
const NewsPoliceForm = document.getElementById('newsPoliceForm');

const NewsEMSGrid = document.querySelector("[news-ems-grid]");
const NewsEMSTemplate = document.querySelector("[news-ems-template]");
const NewsEMSForm = document.getElementById('newsEMSForm');

const NewsMechanicsGrid = document.querySelector("[news-mechanics-grid]");
const NewsMechanicsTemplate = document.querySelector("[news-mechanics-template]");
const NewsMechanicsForm = document.getElementById('newsMechanicsForm');
//comments
const CommentsMainContainer = document.querySelector("[comments-main-container]");
const CommentsMainTemplate = document.querySelector("[comments-main-template]");

const CommentsPoliceContainer = document.querySelector("[comments-police-container]");
const CommentsPoliceTemplate = document.querySelector("[comments-police-template]");


const CommentsEMSContainer = document.querySelector("[comments-ems-container]");
const CommentsEMSTemplate = document.querySelector("[comments-ems-template]");


const CommentsMechanicsContainer = document.querySelector("[comments-mechanics-container]");
const CommentsMechanicsTemplate = document.querySelector("[comments-mechanics-template]");

//announcements
const AnnouncementsPoliceContainer = document.querySelector("[announcements-police-container]");
const AnnouncementsPoliceTemplate = document.querySelector("[announcements-police-template]");


const AnnouncementsEMSContainer = document.querySelector("[announcements-ems-container]");
const AnnouncementsEMSTemplate = document.querySelector("[announcements-ems-template]");

const AnnouncementsMechanicsContainer = document.querySelector("[announcements-mechanics-container]");
const AnnouncementsMechanicsTemplate = document.querySelector("[announcements-mechanics-template]");

//loginglobal
const token = localStorage.getItem('token');
const userName = localStorage.getItem('userName');
const role = localStorage.getItem('role');

//dropdowns
if (navToggle) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('aria-expanded');
        navToggle.blur();
    });
}

if (dropdownToggle) {
    dropdownToggle.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
    });
}

if (loginButton) {
    loginButton.addEventListener('click', () => {
        dropdownLogin.classList.toggle('show');
    });
}   

if (dropdownLogin) {
    dropdownLogin.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}

if (togglenewsForm) {
        togglenewsForm.addEventListener('click', () => {
        newsForm.classList.toggle('active');
        overlay.classList.toggle('active');
    });
}

if (togglenewsFormP) {
  togglenewsFormP.addEventListener('click', () => {
  newsForm.classList.toggle('active');
  overlay.classList.toggle('active');
});
}

if (togglenewsFormE) {
  togglenewsFormE.addEventListener('click', () => {
  newsForm.classList.toggle('active');
  overlay.classList.toggle('active');
});
}

if (togglenewsFormM) {
  togglenewsFormM.addEventListener('click', () => {
  newsForm.classList.toggle('active');
  overlay.classList.toggle('active');
});
}

if (overlay) {
        overlay.addEventListener('click', () => {
        newsForm.classList.remove('active');
        overlay.classList.remove('active');
    });
}

if (cancelNewsButton) {
  cancelNewsButton.addEventListener('click', (event) => {
    event.preventDefault();
    newsForm.classList.remove('active');
    overlay.classList.remove('active');
  });
}


if (newsForm) {
        newsForm.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}

if (PoliceHQLink) {
  if (role === 'Owner' || role === 'Police Chief' || role === 'Police') {
    PoliceHQLink.style.display = 'block';
  } else {
    PoliceHQLink.style.display = 'none';
  };
}

if (EMSHQLink) {
  if (role === 'Owner' || role === 'EMS Chief' || role === 'EMS') {
    EMSHQLink.style.display = 'block';
  } else {
    EMSHQLink.style.display = 'none';
  };
}

if (MechanicsHQLink) {
  if (role === 'Owner' || role === 'Mechanics Chief' || role === 'Mechanics') {
    MechanicsHQLink.style.display = 'block';
  } else {
    MechanicsHQLink.style.display = 'none';
  };
}

window.addEventListener('click', (event) => {
    if (!event.target.matches('.dropdown-toggle')) {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    }
    if (!event.target.closest('.auth-wrapper') && !event.target.closest('.dropdown-login')) {
        if (dropdownLogin.classList.contains('show')) {
            dropdownLogin.classList.remove('show');
        }
    }
});
//end-of-dropdowns

//news-main
if (NewsMainTemplate && NewsMainGrid) {
fetch('https://scapi-nine.vercel.app/homenewstbl')
  .then((response) => response.json())
  .then((data) => {
   newsmainsearch = data.map(newsmain => {
        const newsmainlist = NewsMainTemplate.content.cloneNode(true);
        const newsmainElement = newsmainlist.firstElementChild;
        const heading = newsmainElement.querySelector("[news-main-heading]");
        const description = newsmainElement.querySelector("[news-main-description]");
        const date = newsmainElement.querySelector("[news-main-date]");
        if (heading && description) {
            heading.textContent = newsmain.Title;
            description.textContent = newsmain.Content;
            date.textContent = "Date Published: " + new Date(newsmain.created_at).toISOString().split('T')[0];
            NewsMainGrid.append(newsmainElement);
            return { heading: newsmain.Title, description: newsmain.Content, date: newsmain.created_at, element: newsmainElement };
          } else {
            console.error('Error creating news:', newsmain);
            return null;
          }
          });
  })
  .catch((error) => console.error('Error fetching quests:', error));
}
//news-police
if (NewsPoliceTemplate && NewsPoliceGrid) {
    fetch('https://scapi-nine.vercel.app/policenewstbl')
      .then((response) => response.json())
      .then((data) => {
       newspolicesearch = data.map(newspolice => {
            const newspolicelist = NewsPoliceTemplate.content.cloneNode(true);
            const newspoliceElement = newspolicelist.firstElementChild;
            const heading = newspoliceElement.querySelector("[news-police-heading]");
            const description = newspoliceElement.querySelector("[news-police-description]");
            const date = newspoliceElement.querySelector("[news-police-date]");
            if (heading && description) {
                heading.textContent = newspolice.Title;
                description.textContent = newspolice.Content;
                date.textContent = "Date Published: " + new Date(newspolice.created_at).toISOString().split('T')[0];
                NewsPoliceGrid.append(newspoliceElement);
                return { heading: newspolice.Title, description: newspolice.Content, date: newspolice.created_at, element: newspoliceElement };
              } else {
                console.error('Error creating news:', newspolice);
                return null;
              }
              });
      })
      .catch((error) => console.error('Error fetching quests:', error));
    }
//news-ems
if (NewsEMSTemplate && NewsEMSGrid) {
    fetch('https://scapi-nine.vercel.app/emsnewstbl')
      .then((response) => response.json())
      .then((data) => {
       newsemssearch = data.map(newsems => {
            const newsemslist = NewsEMSTemplate.content.cloneNode(true);
            const newsemsElement = newsemslist.firstElementChild;
            const heading = newsemsElement.querySelector("[news-ems-heading]");
            const description = newsemsElement.querySelector("[news-ems-description]");
            const date = newsemsElement.querySelector("[news-ems-date]");
            if (heading && description) {
                heading.textContent = newsems.Title;
                description.textContent = newsems.Content;
                date.textContent = "Date Published: " + new Date(newsems.created_at).toISOString().split('T')[0];
                NewsEMSGrid.append(newsemsElement);
                return { heading: newsems.Title, description: newsems.Content, date: newsems.created_at, element: newsemsElement };
              } else {
                console.error('Error creating news:', newsems);
                return null;
              }
              });
      })
      .catch((error) => console.error('Error fetching quests:', error));
    }
//news-mechanics
if (NewsMechanicsTemplate && NewsMechanicsGrid) {
    fetch('https://scapi-nine.vercel.app/mechanicsnewstbl')
      .then((response) => response.json())
      .then((data) => {
       newsmechanicssearch = data.map(newsmechanics => {
            const newsmechanicslist = NewsMechanicsTemplate.content.cloneNode(true);
            const newsmechanicsElement = newsmechanicslist.firstElementChild;
            const heading = newsmechanicsElement.querySelector("[news-mechanics-heading]");
            const description = newsmechanicsElement.querySelector("[news-mechanics-description]");
            const date = newsmechanicsElement.querySelector("[news-mechanics-date]");
            if (heading && description) {
                heading.textContent = newsmechanics.Title;
                description.textContent = newsmechanics.Content;
                date.textContent = "Date Published: " + new Date(newsmechanics.created_at).toISOString().split('T')[0];
                NewsMechanicsGrid.append(newsmechanicsElement);
                return { heading: newsmechanics.Title, description: newsmechanics.Content, date: newsmechanics.created_at, element: newsmechanicsElement };
              } else {
                console.error('Error creating news:', newsmechanics);
                return null;
              }
              });
      })
      .catch((error) => console.error('Error fetching quests:', error));
    }


//comments-main
if (CommentsMainTemplate && CommentsMainContainer) {
    fetch('https://scapi-nine.vercel.app/homecommenttbl')
      .then((response) => response.json())
      .then((data) => {
       commentsmainsearch = data.map(commentsmain => {
            const commentsmainlist = CommentsMainTemplate.content.cloneNode(true);
            const commentsmainElement = commentsmainlist.firstElementChild;
            const heading = commentsmainElement.querySelector("[comments-main-username]");
            const description = commentsmainElement.querySelector("[comments-main-description]");
            if (heading && description) {
                heading.textContent = commentsmain.UserName;
                description.textContent = commentsmain.Content;
                CommentsMainContainer.append(commentsmainElement);
                return { heading: commentsmain.UserName, description: commentsmain.Content, element: commentsmainElement };
              } else {
                console.error('Error creating comments:', commentsmain);
                return null;
              }
              });
      })
      .catch((error) => console.error('Error fetching comments:', error));
    }
//comments-police
if (CommentsPoliceTemplate && CommentsPoliceContainer) {
    fetch('https://scapi-nine.vercel.app/policecommenttbl')
      .then((response) => response.json())
      .then((data) => {
       commentspolicesearch = data.map(commentspolice => {
            const commentspolicelist = CommentsPoliceTemplate.content.cloneNode(true);
            const commentspoliceElement = commentspolicelist.firstElementChild;
            const heading = commentspoliceElement.querySelector("[comments-police-username]");
            const description = commentspoliceElement.querySelector("[comments-police-description]");
            if (heading && description) {
                heading.textContent = commentspolice.UserName;
                description.textContent = commentspolice.Content;
                CommentsPoliceContainer.append(commentspoliceElement);
                return { heading: commentspolice.UserName, description: commentspolice.Content, element: commentspoliceElement };
              } else {
                console.error('Error creating comments:', commentspolice);
                return null;
              }
              });
      })
      .catch((error) => console.error('Error fetching comments:', error));
    }
//comments-ems
if (CommentsEMSTemplate && CommentsEMSContainer) {
    fetch('https://scapi-nine.vercel.app/emscommenttbl')
      .then((response) => response.json())
      .then((data) => {
       commentsemssearch = data.map(commentsems => {
            const commentsemslist = CommentsEMSTemplate.content.cloneNode(true);
            const commentsemsElement = commentsemslist.firstElementChild;
            const heading = commentsemsElement.querySelector("[comments-ems-username]");
            const description = commentsemsElement.querySelector("[comments-ems-description]");
            if (heading && description) {
                heading.textContent = commentsems.UserName;
                description.textContent = commentsems.Content;
                CommentsEMSContainer.append(commentsemsElement);
                return { heading: commentsems.UserName, description: commentsems.Content, element: commentsemsElement };
              } else {
                console.error('Error creating comments:', commentsems);
                return null;
              }
              });
      })
      .catch((error) => console.error('Error fetching comments:', error));
    }
//comments-mechanics
if (CommentsMechanicsTemplate && CommentsMechanicsContainer) {
    fetch('https://scapi-nine.vercel.app/mechanicscommenttbl')
      .then((response) => response.json())
      .then((data) => {
       commentsmechanicssearch = data.map(commentsmechanics => {
            const commentsmechanicslist = CommentsMechanicsTemplate.content.cloneNode(true);
            const commentsmechanicsElement = commentsmechanicslist.firstElementChild;
            const heading = commentsmechanicsElement.querySelector("[comments-mechanics-username]");
            const description = commentsmechanicsElement.querySelector("[comments-mechanics-description]");
            if (heading && description) {
                heading.textContent = commentsmechanics.UserName;
                description.textContent = commentsmechanics.Content;
                CommentsMechanicsContainer.append(commentsmechanicsElement);
                return { heading: commentsmechanics.UserName, description: commentsmechanics.Content, element: commentsmechanicsElement };
              } else {
                console.error('Error creating comments:', commentsmechanics);
                return null;
              }
              });
      })
      .catch((error) => console.error('Error fetching comments:', error));
    }

//announcements-police
if (AnnouncementsPoliceTemplate && AnnouncementsPoliceContainer) {
 fetch('https://scapi-nine.vercel.app/policeannouncementtbl')
  .then ((response) => response.json())
  .then ((data) => {
    announcementspolicesearch = data.map(announcementspolice => {
        const announcementspolicelist = AnnouncementsPoliceTemplate.content.cloneNode(true);
        const announcementspoliceElement = announcementspolicelist.firstElementChild;
        const heading = announcementspoliceElement.querySelector("[announcements-police-heading]");
        const description = announcementspoliceElement.querySelector("[announcements-police-description]");
        if (heading && description) {
            heading.textContent = announcementspolice.Title;
            description.textContent = announcementspolice.Content;
            AnnouncementsPoliceContainer.append(announcementspoliceElement);
            return { heading: announcementspolice.Title, description: announcementspolice.Content, element: announcementspoliceElement };
          } else {
            console.error('Error creating announcements:', announcementspolice);
            return null;
          }
          });
 })
}

//announcements-ems
if (AnnouncementsEMSTemplate && AnnouncementsEMSContainer) {
  fetch('https://scapi-nine.vercel.app/emsannouncementtbl')
    .then((response) => response.json())
    .then((data) => {
      announcementsemssearch = data.map(announcementsems => {
            const announcementsemslist = AnnouncementsEMSTemplate.content.cloneNode(true);
            const announcementsemsElement = announcementsemslist.firstElementChild;
            const heading = announcementsemsElement.querySelector("[announcements-ems-heading]");
            const description = announcementsemsElement.querySelector("[announcements-ems-description]");
            if (heading && description) {
                heading.textContent = announcementsems.Title;
                description.textContent = announcementsems.Content;
                AnnouncementsEMSContainer.append(announcementsemsElement);
                return { heading: announcementsems.Title, description: announcementsems.Content, element: announcementsemsElement };
              } else {
                console.error('Error creating announcements:', announcementsems);
                return null;
              }
              });
    })
}

//announcements-mechanics
if (AnnouncementsMechanicsTemplate && AnnouncementsMechanicsContainer) {
  fetch('https://scapi-nine.vercel.app/mechanicsannouncementtbl')
    .then((response) => response.json())
    .then((data) => {
      announcementsmechanicssearch = data.map(announcementsmechanics => {
            const announcementsmechanicslist = AnnouncementsMechanicsTemplate.content.cloneNode(true);
            const announcementsmechanicsElement = announcementsmechanicslist.firstElementChild;
            const heading = announcementsmechanicsElement.querySelector("[announcements-mechanics-heading]");
            const description = announcementsmechanicsElement.querySelector("[announcements-mechanics-description]");
            if (heading && description) {
                heading.textContent = announcementsmechanics.Title;
                description.textContent = announcementsmechanics.Content;
                AnnouncementsMechanicsContainer.append(announcementsmechanicsElement);
                return { heading: announcementsmechanics.Title, description: announcementsmechanics.Content, element: announcementsmechanicsElement };
              } else {
                console.error('Error creating announcements:', announcementsmechanics);
                return null;
              }
              });
    })
}
//registration
if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const userName = document.getElementById('registerUserName').value;
        const userEmail = document.getElementById('registerUserEmail').value;
        const password = document.getElementById('registerPassword').value;
    
        const response = await fetch('https://scapi-nine.vercel.app/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UserName: userName,
                UserEmail: userEmail,
                Password: password
            })
        });
    
        if (response.ok) {
            alert('User registered successfully');
            location.reload();
        } else {
            alert('Error registering user');
        }
    });
}

//login

if (token && userName) {
  loginForm.style.display = 'none';
  loginButton.style.display = 'none';
  logoutButton.style.display = 'block';
  userNameDisplay.textContent = "Current Account: " + userName;

  if (togglenewsForm) {
    if (role === 'Owner') {
      togglenewsForm.style.display = 'block';
  } else {
      togglenewsForm.style.display = 'none';
  };
  };
  
  if (togglenewsFormP) {
    if (role === 'Owner' || role === 'Police Chief') {
      togglenewsFormP.style.display = 'block';
    } else {
      togglenewsFormP.style.display = 'none';
    };
  };
  if (togglenewsFormE) {
    if (role === 'Owner' || role === 'EMS Chief') {
      togglenewsFormE.style.display = 'block';
    } else {
      togglenewsFormE.style.display = 'none';
    };
  };
  if (togglenewsFormM) {
    if (role === 'Owner' || role === 'Mechanics Chief') {
      togglenewsFormM.style.display = 'block';
    } else {
      togglenewsFormM.style.display = 'none';
    };
  };
} else {
  loginForm.style.display = 'block';
  logoutButton.style.display = 'none';
  userNameDisplay.textContent = '';
}

if (PoliceHQLink) {
  PoliceHQLink.addEventListener('click', async (event) => {
    event.preventDefault();
  
    const response = await fetch('/restricted/PoliceOnly.html', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    const html = await response.text();
      document.documentElement.innerHTML = html;
    } else {
      alert('Access denied');
    }
  });
  }

  //restrictedaccess-Police
  if (PoliceHQLink) {
    PoliceHQLink.addEventListener('click', async (event) => {
      event.preventDefault();
    
      const response = await fetch('/restricted/PoliceOnly.html', {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`
      }
    });
  
  if (response.ok) {
    const html = await response.text();
      document.documentElement.innerHTML = html;
    } else {
      alert('Access denied');
    }
  });
}

//restrictedaccess-EMS
if (EMSHQLink) {
  EMSHQLink.addEventListener('click', async (event) => {
    event.preventDefault();
  
    const response = await fetch('/restricted/EMSOnly.html', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });

if (response.ok) {
  const html = await response.text();
    document.documentElement.innerHTML = html;
  } else {
    alert('Access denied');
  }
});
}

//restrictedaccess-Mechanics
if (MechanicsHQLink) {
  MechanicsHQLink.addEventListener('click', async (event) => {
    event.preventDefault();
  
    const response = await fetch('/restricted/MechanicsOnly.html', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });

if (response.ok) {
  const html = await response.text();
    document.documentElement.innerHTML = html;
  } else {
    alert('Access denied');
  }
});
}


if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const userName = document.getElementById('loginUserName').value;
        const password = document.getElementById('loginPassword').value;
    
        const response = await fetch('https://scapi-nine.vercel.app/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UserName: userName,
                Password: password
            })
        });
    
        if (response.ok) {
          try {
              const result = await response.json();
              localStorage.setItem('token', result.token);
              const decodedToken = JSON.parse(atob(result.token.split('.')[1]));
              localStorage.setItem('userName', decodedToken.username);
              localStorage.setItem('role', decodedToken.role);
              alert('Login successful');
              location.reload();
          } catch (error) {
              console.error('Error parsing JSON:', error);
              alert('Error logging in');
          }
      } else {
          alert('Error logging in');
      }
    });
}
// //end-of-registration/login

//logout
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('role');
      alert('Logged out successfully');
      location.reload();
  });
}
//end-of-logout

//news-input
if (NewsMainForm) {
    NewsMainForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const heading = document.getElementById('newsmainHeading').value;
        const content = document.getElementById('newsmainContent').value;
    
        const response = await fetch('https://scapi-nine.vercel.app/homenewstbl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                Title: heading,
                Content: content
            })
        });
    
        if (response.ok) {
            alert('News created successfully');
            location.reload();
        } else {
            alert('Error creating news');
        }
    });
}

if (NewsPoliceForm) {
    NewsPoliceForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const heading = document.getElementById('newspoliceHeading').value;
      const content = document.getElementById('newspoliceContent').value;

      const response = await fetch('https://scapi-nine.vercel.app/policenewstbl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Title: heading,
          Content: content
        })
      });

      if(response.ok) {
        alert('News created successfully');
        location.reload();
      } else {
        alert('Error creating news');
      }
  });
}

if (NewsEMSForm) {
  NewsEMSForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const heading = document.getElementById('newsemsHeading').value;
    const content = document.getElementById('newsemsContent').value;

    const response = await fetch('https://scapi-nine.vercel.app/emsnewstbl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        Title: heading,
        Content: content
      })
    });

    if(response.ok) {
      alert('News created successfully');
      location.reload();
    } else {
      alert('Error creating news');
    }
});
}

if (NewsMechanicsForm) {
  NewsMechanicsForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const heading = document.getElementById('newsmechanicsHeading').value;
    const content = document.getElementById('newsmechanicsContent').value;

    const response = await fetch('https://scapi-nine.vercel.app/mechanicsnewstbl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        Title: heading,
        Content: content
      })
    });

    if(response.ok) {
      alert('News created successfully');
      location.reload();
    } else {
      alert('Error creating news');
    }
});
}
//end-of-news-input

//comments-input
// if (newscommentsForm) {
//     newscommentsForm.addEventListener('submit', async (event) => {
//         event.preventDefault();
    
//         const userName = document.getElementById('newscommentsUserName').value;
//         const content = document.getElementById('newscommentsContent').value;
    
//         const response = await fetch('https://scapi-nine.vercel.app/homecommenttbl', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 UserName: userName,
//                 Content: content
//             })
//         });
    
//         if (response.ok) {
//             alert('Comment created successfully');
//         } else {
//             alert('Error creating comment');
//         }
//     });
// }
//end-of-comments-input

//announcements-input

//end-of-announcements-input