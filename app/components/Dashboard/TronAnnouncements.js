import React, {Component} from 'react';
import Secondary from "../Content/Secondary";
import axios from "axios";
import styles from "./TronAnnouncements.css";

class TronAnnouncements extends Component {

  constructor(){
    super();
    this.state = {
      data:[],
      status : false
    }
    this.getAnnouncements = this.getAnnouncements.bind(this);
    this.showAnnouncementDetails = this.showAnnouncementDetails.bind(this);
  }

  getAnnouncements () {
    var announcements = null;
    axios.get('https://apilist.tronscan.org/api/announcement?type=1&start=0&limit=10&status=0&sort=-timestamp')
        .then(res => this.setState({ data: res.data.data}))
        .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getAnnouncements();
  }

  showAnnouncementDetails(key){
    document.getElementById("announcementDetails").innerHTML = this.state.data[key.i].contextEN;
  }

  render() {
      return (
          <Secondary>
              <div>
                {
                  this.state.data.map((announcement,i) => {
                    return (
                        <div className={styles.announcement} key={i}>
                            <p>{announcement.titleEN}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a onClick={() => this.showAnnouncementDetails({i})}>More details ></a></p>
                        </div>
                    )
                  })
                }
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <div id="announcementDetails"></div>
              </div>
          </Secondary>
      )
    }
}
export default TronAnnouncements;
