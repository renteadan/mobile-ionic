import React from 'react';
import {
  CreateAnimation,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import Service from '../service/service';

interface ITab1Props extends RouteComponentProps {}
interface ITab1State {
  redirect: string;
}

class Tab1 extends React.Component<ITab1Props, ITab1State> {
  service: Service;
  constructor(props: ITab1Props) {
    super(props);
    this.service = new Service();
    this.state = {
      redirect: ''
    };
  }

  logout() {
    this.service.logout();
    this.setState({
      redirect: '/'
    });
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to={redirect} />;
    }
    // this.service.getTeamsWithWs();
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <CreateAnimation
              play={true}
              duration={1000}
              iterations={1}
              fromTo={[
                {
                  property: 'transform',
                  fromValue: 'translateX(300px)',
                  toValue: 'translateY(0px)'
                },
                { property: 'opacity', fromValue: '0', toValue: '1' }
              ]}
            >
              <IonTitle>Tab 1</IonTitle>
              <IonButton onClick={() => this.logout()}>Logout</IonButton>
            </CreateAnimation>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Tab 1</IonTitle>
            </IonToolbar>
          </IonHeader>
          <ExploreContainer name="Tab 1 page" />
        </IonContent>
      </IonPage>
    );
  }
}

export default withRouter(Tab1);
