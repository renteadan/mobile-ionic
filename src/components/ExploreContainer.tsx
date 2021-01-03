import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonButton,
  IonImg,
  IonThumbnail,
  createAnimation
} from '@ionic/react';
import React from 'react';
import './ExploreContainer.css';
import Service from '../service/service';
import { Bike } from '../models/BikeList';
import { Camera, DestinationType, MediaType } from '@ionic-native/camera';
import { initMap } from './GMap';

interface IContainerProps {
  name: string;
}

interface IContainerState {
  bikes: Bike[];
  showModal: string;
}

class ExploreContainer extends React.Component<
  IContainerProps,
  IContainerState
> {
  service: Service;
  constructor(props: IContainerProps) {
    super(props);
    this.state = {
      bikes: [],
      showModal: ''
    };
    this.service = new Service();
  }

  async takePicture(bike: Bike) {
    const data = await Camera.getPicture({
      destinationType: DestinationType.DATA_URL,
      mediaType: MediaType.PICTURE,
      quality: 20
    });
    bike.img_url = `data:image;base64,${data}`;
    await this.service.updateBike(bike);
    window.location.reload();
  }

  generate(bikes: Bike[]) {
    const log = (bike: Bike) => async (a: any, b: any) => {
      bike.lat = a;
      bike.lon = b;
      await this.service.updateBike(bike);
      window.location.reload();
    };

    return bikes.map((bike) => {
      return (
        <IonItem key={bike.name}>
          <IonLabel
            onClick={() =>
              this.setState({
                showModal: bike.name
              })
            }
          >
            {bike.name}
          </IonLabel>
          <IonThumbnail slot="end">
            <IonImg src={bike.img_url} />
          </IonThumbnail>
          <IonModal
            isOpen={bike.name === this.state.showModal}
            onDidPresent={() =>
              initMap({ lat: bike.lat || 0, lng: bike.lon || 0 }, log(bike))
            }
            enterAnimation={this.enterAnimation}
          >
            <p>Bike name: {bike.name}</p>
            <p>Bike model: {bike.model}</p>
            <img
              src={bike.img_url}
              alt="Team pic"
              height="300px"
              width="auto"
            />
            <div id="map"></div>
            <IonButton
              onClick={() =>
                this.setState({
                  showModal: ''
                })
              }
            >
              Close
            </IonButton>
            <IonButton onClick={() => this.takePicture(bike)}>
              Take photo!
            </IonButton>
          </IonModal>
        </IonItem>
      );
    });
  }

  async componentDidMount() {
    const { data } = await this.service.getBikes();
    this.setState({ bikes: data });
  }
  enterAnimation(baseEl: any) {
    const backdropAnimation = createAnimation()
      .addElement(baseEl.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(baseEl.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' }
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }

  leaveAnimation(baseEl: any) {
    return this.enterAnimation(baseEl).direction('reverse');
  }
  render() {
    const { bikes } = this.state;
    return (
      <IonContent class="container">
        <IonList>{this.generate(bikes)}</IonList>
      </IonContent>
    );
  }
}

export default ExploreContainer;
