import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import React from 'react';
import {RouteComponentProps, withRouter } from 'react-router-dom';
import InfiniteScroll from '../components/InfiniteScroll';
import Service from '../service/service';

interface ITab2Props extends RouteComponentProps {}
interface ITab2State {
  items: any[];
  disableInfiniteScroll: boolean;
  pageSize: number;
}

class Tab2 extends React.Component<ITab2Props, ITab2State> {
  service: Service;
  constructor(props: ITab2Props) {
    super(props);
    this.service = new Service();
    this.state = {
      items: [],
      disableInfiniteScroll: false,
      pageSize: 20,
    }
  }

  async fetchData(skip: number, limit: number) {
    const response = await this.service.getBikes(skip, limit);
    const bikes = response.data;
    if(bikes && bikes.length > this.state.pageSize) {
      this.setState({
        items: bikes,
        disableInfiniteScroll: true,
      });
      return;
    }
    if (bikes && bikes.length > 0) {
      this.setState(
        {
          items: [...this.state.items, ...bikes],
          disableInfiniteScroll: bikes.length < this.state.pageSize,
        }
      )
    } else {
      this.setState({
        disableInfiniteScroll: true,
      });
    }
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Tab 1</IonTitle>
            </IonToolbar>
          </IonHeader>
          <InfiniteScroll {...this.state} fetchData={async (skip: number, limit: number) => await this.fetchData(skip, limit)}/>
        </IonContent>
      </IonPage>
    );
  }
};

export default withRouter(Tab2);
