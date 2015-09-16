#### Requirements for Digital ocean
1. Upload your private key. Create authentication token. Set authentication token as enviornment variable. 
```
export DIGITAL_OCEAN_TOKEN="Your token"
export DIGITAL_OCEAN_KEY="Your key id"
export DIGITAL_OCEAN_KEY_PATH="Path to private key used for digital ocean"
```

#### Requirements for AWS
1. Create a credentials file at ~/.aws/credentials on Mac/Linux or C:\Users\USERNAME\.aws\credentials on Windows
    
    ```
    [default]
    aws_access_key_id = your_access_key
    aws_secret_access_key = your_secret_key
    ```
2. Set the path of private key used in enviornment variable
    
    ```
    export AWS_PRIVATE_KEY_PATH="Path to private key used to create image"
    ```
3. Attach a full access policy with the user. After you have created the IAM user and generated the access keys, by default the user is not allowed to perform all the actions. One need to select a access policy and attach it to user. 

    - Go to https://console.aws.amazon.com/iam/home#policies ->  Search for AmazonEC2FullAccess -> Hit 'create Policy' button -> Select 'Copy an AWS Managed Policy' -> 'AdministratorAccess' -> 'Create Policy'. Once the policy is created, select it and attach to your user.

#### Install Ansible on control machine: 
```
sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install ansible
```
#### Install NodeJs on control machine:

Follow instructions on https://nodejs.org/en/download/

#### Running script:

1. Clone the repository `git clone https://github.com/nirmeshkhandelwal/DevOps.git`
2. Go inside DevOps/HW/HW_1/ directory `cd DevOps/HW/HW_1/`
3. Run `npm install` to install all dependencies.
4. Run `node main.js`