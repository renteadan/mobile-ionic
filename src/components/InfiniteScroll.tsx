import {
  IonContent,
  IonInfiniteScroll, IonInfiniteScrollContent, withIonLifeCycle, IonButton, IonItem, IonLabel, IonModal
} from '@ionic/react';
import React from 'react';
import { Bike } from '../models/BikeList';

interface IInfiniteScrollProps {
  items: any[];
  disableInfiniteScroll: boolean;
  fetchData(skip: number, limit: number): any;
  pageSize: number;
}

interface IInfiniteScrollContainer {
  skip: number;
  limit: number;
  showModal: string;
}

class InfiniteScroll extends React.Component<IInfiniteScrollProps, IInfiniteScrollContainer> {

  constructor(props: IInfiniteScrollProps) {
    super(props);
    this.state = {
      skip: 0,
      limit: this.props.pageSize,
      showModal: ''
    };
  }


  async searchNext($event: CustomEvent<void>) {
    const {skip, limit} = this.state;
    this.setState({
      skip: skip + this.props.pageSize
    });
    await this.props.fetchData(skip, limit);

    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  async ionViewWillEnter() {
    const {skip, limit} = this.state;
    await this.props.fetchData(skip, limit);
    this.setState({
      skip: skip + this.props.pageSize
    });
  };

  generate(bikes: Bike[]) {
    return bikes.map(bike => {
      return (
        <IonItem key={bike.name}
        >
          <IonLabel onClick={() => this.setState({
            showModal: bike.name
          })}>{bike.name}</IonLabel>
          <IonModal
            isOpen={bike.name === this.state.showModal}
          >
            <p>Bike name: {bike.name}</p>
            <p>Bike model: {bike.model}</p>
            <img src={bike.img_url} alt="Team pic" height="300px" width="auto"/>
            <IonButton onClick={() => this.setState({
              showModal: ''
            })}>Close</IonButton>
          </IonModal>
        </IonItem>
      );
    });
  }

  render() {
    const {items, disableInfiniteScroll} = this.props;

    return (
      <IonContent>
        {this.generate(items)}

        <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                            onIonInfinite={(e: CustomEvent<void>) => this.searchNext(e)}>
          <IonInfiniteScrollContent
              loadingText="Loading more bikes...">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
  );
  }
}

export default withIonLifeCycle(InfiniteScroll);