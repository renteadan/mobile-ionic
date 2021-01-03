import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  withIonLifeCycle,
  IonButton,
  IonItem,
  IonLabel,
  IonModal,
  CreateAnimation
} from '@ionic/react';
import React from 'react';
import { Bike } from '../models/BikeList';
import _ from 'lodash';

interface IInfiniteScrollProps {
  items: any[];
  disableInfiniteScroll: boolean;
  fetchData(skip: number, limit: number): any;
  pageSize: number;
}

interface IInfiniteScrollState {
  skip: number;
  limit: number;
  showModal: string;
  anims: React.RefObject<CreateAnimation>[];
}

class InfiniteScroll extends React.Component<
  IInfiniteScrollProps,
  IInfiniteScrollState
> {
  constructor(props: IInfiniteScrollProps) {
    super(props);
    this.state = {
      skip: 0,
      limit: this.props.pageSize,
      showModal: '',
      anims: []
    };
  }

  async searchNext($event: CustomEvent<void>) {
    const { skip, limit } = this.state;
    this.setState({
      skip: skip + this.props.pageSize
    });
    await this.props.fetchData(skip, limit);

    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  async ionViewWillEnter() {
    const { skip, limit } = this.state;
    await this.props.fetchData(skip, limit);
    this.setState({
      skip: skip + this.props.pageSize
    });
  }

  generate(bikes: Bike[]) {
    const { anims } = this.state;
    const items = bikes.map((bike, i) => {
      return (
        <IonItem key={bike.name}>
          <CreateAnimation
            ref={anims[i]}
            duration={100}
            iterations={1}
            fromTo={[
              {
                property: 'transform',
                fromValue: 'translateX(50%)',
                toValue: 'translateX(0px)'
              },
              { property: 'opacity', fromValue: '0', toValue: '1' }
            ]}
            afterStyles={{
              opacity: 1
            }}
          >
            <IonLabel
              onClick={() =>
                this.setState({
                  showModal: bike.name
                })
              }
              style={{
                opacity: 0
              }}
            >
              {bike.name}
            </IonLabel>
          </CreateAnimation>
          <IonModal isOpen={bike.name === this.state.showModal}>
            <p>Bike name: {bike.name}</p>
            <p>Bike model: {bike.model}</p>
            <img
              src={bike.img_url}
              alt="Team pic"
              height="300px"
              width="auto"
            />
            <IonButton
              onClick={() =>
                this.setState({
                  showModal: ''
                })
              }
            >
              Close
            </IonButton>
          </IonModal>
        </IonItem>
      );
    });
    return items;
  }

  reductivePromiseChain(anims: React.RefObject<CreateAnimation>[]) {
    return anims.reduce((chain, anim) => {
      if (!chain) {
        return Promise.resolve();
      }
      return chain.then(async (_) => {
        await anim.current?.animation.play();
        return anim.current?.animation.destroy();
      });
    }, Promise.resolve());
    //   return Promise.all(anims.map(async anim => {
    //     anim.current?.animation.duration((Math.random() * 2000) + 1);
    //     await anim.current?.animation.play();
    //     return anim.current?.animation.destroy();
    //   }
    // ))
  }

  async componentDidMount() {}

  async componentDidUpdate(
    prevProps: IInfiniteScrollProps,
    prevState: IInfiniteScrollState
  ) {
    const { anims } = this.state;
    const n = [];
    if (this.props.items.length !== prevProps.items.length) {
      for (
        let i = 0;
        i < this.props.items.length - prevProps.items.length;
        i++
      ) {
        const ref: React.RefObject<CreateAnimation> = React.createRef();
        n.push(ref);
      }
      return this.setState({ anims: [...this.state.anims, ...n] });
    }
    if (this.state.anims.length) {
      const currentAnims = _.cloneDeep(anims);
      await this.reductivePromiseChain(currentAnims);
      return;
    }
  }

  render() {
    const { items, disableInfiniteScroll } = this.props;
    return (
      <IonContent>
        {this.generate(items)}

        <IonInfiniteScroll
          threshold="100px"
          disabled={disableInfiniteScroll}
          onIonInfinite={(e: CustomEvent<void>) => this.searchNext(e)}
        >
          <IonInfiniteScrollContent loadingText="Loading more bikes..."></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    );
  }
}

export default withIonLifeCycle(InfiniteScroll);
