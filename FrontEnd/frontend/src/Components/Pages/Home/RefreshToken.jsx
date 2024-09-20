import React, { useState, useEffect } from 'react'

const RefreshToken = () => {

  useEffect(() => {

    const interval = setInterval(() => {
      refreshToken()
    }, 14 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);

  }, [])

  async function refreshToken() {

    const refresh_Token = sessionStorage.getItem('accesstoken');
    const storedObject = JSON.parse(refresh_Token);

    const refreshtoken = {
      refreshtoken: storedObject.refreshtoken
    }
    try {
      const msg = await fetch("http://localhost:3008/api/refresh", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'authorization': `Bearer ${storedObject.accesstoken}`  
        },
        body: JSON.stringify(refreshtoken)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to refresh token:', error);
        // Consider user-friendly notification instead of alert
        alert('Failed to refresh token. Please log in again.');
        return;
      }

      const newdatas = await msg.json();


      if (msg.ok) {
        storedObject.accesstoken = newdatas.access_token
        storedObject.access_token_expiration = newdatas.access_token_expiration
        const NewData = JSON.stringify(storedObject)
        console.log(storedObject);
        sessionStorage.setItem('accessToken', NewData);

      }
      else {
        console.log("value varalada domaru");
        alert("refreshtoken feild");
      }

    }

    catch (error) {
      console.error('Error logout :', error);

    }

  }

  return (
    <div>

    </div>
  )
}

export default RefreshToken
