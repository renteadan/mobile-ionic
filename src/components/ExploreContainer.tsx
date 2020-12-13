import { IonContent, IonItem, IonLabel, IonList, IonModal, IonButton } from '@ionic/react';
import React from 'react';
import './ExploreContainer.css';
import Service from '../service/service';
import { Bike } from '../models/BikeList';

interface IContainerProps {
  name: string;
}

interface IContainerState {
  bikes: Bike[];
  showModal: string;
}

class ExploreContainer extends React.Component<IContainerProps, IContainerState> {
  service: Service;
  constructor(props: IContainerProps) {
    super(props);
    this.state = {
      bikes: [],
      showModal: ''
    }
    this.service = new Service();
  }

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

  async componentDidMount() {
    const { data } = await this.service.getBikes();
    this.setState({ bikes: data });
  }

  render() {
    const { bikes } = this.state;
    return (
      <IonContent class="container">
        <IonList>
          {this.generate(bikes)}
        </IonList>
      </IonContent>
    );
  }
}

export default ExploreContainer;
