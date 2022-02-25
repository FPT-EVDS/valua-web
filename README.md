## Valua Web
# How to install
- Install Node V14 LTS ( note: V16 will not run due to the SCSS library ). Download link: https://nodejs.org/dist/v14.16.1/
![image](https://user-images.githubusercontent.com/54258769/139083262-266b6f1d-80d4-4ccc-b502-ef3c483ce9e4.png)
- After node has been install, run node --version to check the version. If installed correctly, it will show the following screen:
![image](https://user-images.githubusercontent.com/54258769/139083500-f93ac3f1-b834-4b6d-a117-85879e0168a1.png)
- Check npm version
![image](https://user-images.githubusercontent.com/54258769/139083720-43323767-d0b3-446a-9a77-5eeebf5737d0.png)
- Install yarn by run the following command: npm install -g yarn
![image](https://user-images.githubusercontent.com/54258769/139083918-334e3a65-f6c7-4eed-97e8-fb4e7312feb2.png)
- Clone the project and open it in your preffered IDE ( VSCode is recommended )
![image](https://user-images.githubusercontent.com/54258769/139084250-8e265ff2-288a-44b5-a13b-f4b695c9bc65.png)
- On the terminal, enter: yarn. It will install all the necessary packages for the project
![image](https://user-images.githubusercontent.com/54258769/139084421-514de3e1-a58c-40c6-bc52-0c0104e2b5fc.png)
- After yarn finished, run **yarn start** to run the project. It will run at http://localhost:3000
- Result:
![image](https://user-images.githubusercontent.com/54258769/139084854-edfc40e7-da94-473e-8421-b25a52afb43c.png)

# How to run in production mode
- Step 1: Run <code>npm install -g serve</code>
- Step 2: Navigate to valua-web root folder
- Step 3: Run <code>yarn build</code> (Might took a while)
- Step 4: Run <code>serve -s build</code>
- The final result should be:

![image](https://user-images.githubusercontent.com/54258769/155705865-412da008-c2cd-4a09-933d-2d0c01826468.png)


