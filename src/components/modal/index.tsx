import React, { Component, PropsWithChildren, ReactNode, createRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './style.module.scss';
import { Observable } from 'rxjs';
import { CSSTransition } from 'react-transition-group';

interface Footer {
  text: string;
  callback?: (val?: any) => void;
}
interface Props extends PropsWithChildren<any>{
  header?: string | ReactNode;
  content?: string | ReactNode;
  footer?: Footer[];
  maskClick?: (e: any) => void;
}
const defaultProps: Props = {
  header: '提示',
  footer: []
};

export class Modal extends Component<Props, any> {
  static defaultProps: Props = defaultProps;
  readonly state = {
    show: false
  };

  preventClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }
  show() {
    this.setState({ show: true });
  }
  hide() {
    this.setState({ show: false });
  }

  render() {
    const { header, content, footer, maskClick } = this.props;
    const { show } = this.state;
    return (
      <CSSTransition
        in={show}
        classNames={{
          enter: styles.modalEnter,
          enterActive: styles.modalEnterActive,
          exit: styles.modalExit,
          exitActive: styles.modalExitActive,
          exitDone: styles.modalExitDone
        }}
        timeout={300}
      >
        <div className={styles.modalWrapper} onClick={maskClick}>
          <div className={styles.modal} onClick={this.preventClick.bind(this)}>
            <div className={styles.modalHeader}>{ header }</div>
            <div className={styles.modalContent}>{ content }</div>
            <div className={styles.modalFooter}>
              {
                footer?.map((item, key) =>(
                  <button key={key} className={styles.button} onClick={item.callback}>{item.text}</button>
                ))
              }
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export class ModalService {
  ele: Element[] = [];

  create(
    options: { title: string; content: string | ReactNode; footer: Footer[]; },
    callback?: (result?: any) => void
  ): { close(): void; } {
    const { title, content, footer } = options;
    const container = document.createElement('div');
    container.className = 'modal-container';
    document.body.appendChild(container);
    const instance = createRef<Modal>();
    ReactDOM.render(
      <Modal
        ref={instance}
        header={ title }
        content={ content }
        maskClick={ callback }
        footer={ footer }
      />,
      container
    );
    this.ele.push(container);
    instance.current?.show();
    return {
      close: () => {
        instance.current?.hide();
        setTimeout(() => this.destroy(container), 300);
      }
    };
  }
  confirm(options: { title?: string; content: string | ReactNode; }): Observable<boolean> {
    const { title = '提示', content } = options;
    return new Observable(subscribe => {
      const works = this.create({
        title,
        content,
        footer: (
          [{
            text: '取消',
            callback: () => {
              works.close();
              subscribe.next();
              subscribe.complete();
            }
          }, {
            text: '确定',
            callback: () => {
              works.close();
              subscribe.next(true);
              subscribe.complete();
            }
          }]
        )
      });
    });
  }
  alert(content?: string | ReactNode): Observable<boolean> {
    return new Observable(subscriber => {
      const works = this.create({
        title: '提示',
        content,
        footer: [{
          text: '好的',
          callback: () => {
            works.close();
            subscriber.next(true);
            subscriber.complete();
          }
        }]
      });
    });
  }

  destroy(ele: Element) {
    ReactDOM.unmountComponentAtNode(ele);
    ele.remove();
    const index = this.ele.indexOf(ele);
    if (index > -1) {
      this.ele.splice(index, 1);
    }
  }
  destroyAll() {
    this.ele.forEach(el => {
      ReactDOM.unmountComponentAtNode(el);
      el.remove();
    });
  }
}

export const modal = new ModalService();
