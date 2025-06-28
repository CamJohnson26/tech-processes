
# Deploy Python script to ubuntu server
* TODO: Update this to also set python version on a per worker basis, dependencies are rough
* Create setup.sh with any dependencies
* Add main.py to your repo, with a command that kicks off what you want
* Put it in `if __name__ == '__main__':`
* ```
from dotenv import load_dotenv
load_dotenv()

async def main():

    # Keep the event loop running
    # Create an Event to keep the script running
    stop_event = asyncio.Event()

    # Wait indefinitely
    await stop_event.wait()
...
asyncio.run(main())
```
* git clone https://github.com/CamJohnson26/cj-util-scripts.git
* chmod +x cj-util-scripts/deploy_python.sh
* Run ./cj-util-scripts/deploy-python.sh REPO
* Create the env file when prompted in ~/worker-jobs/REPO_NAME
* chmod +x REPO_NAME/setup.sh
* Manually run setup.sh
* `tail -f worker-jobs/REPO_NAME/nohup.out`
* To kill it, run `ps aux | grep python3 | grep main.py`
* Note: if you add a package to requirements.txt, may have to delete the venv folder
* Note: If you run the setup script, you have to discard the changes to pull
