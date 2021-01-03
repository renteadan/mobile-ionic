import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Service from '../service/service';
import SearchContainer from '../components/SearchContainer';

interface ITab1Props extends RouteComponentProps {}
interface ITab1State {}

class Tab3 extends React.Component<ITab1Props, ITab1State> {
  service: Service;
  constructor(props: ITab1Props) {
    super(props);
    this.service = new Service();
  }
  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Tab 3</IonTitle>
            </IonToolbar>
          </IonHeader>
          <SearchContainer name="Tab 3 search" />
        </IonContent>
      </IonPage>
    );
  }
}

export default withRouter(Tab3);
