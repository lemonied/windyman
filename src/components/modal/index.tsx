import React, { Component, PropsWithChildren, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styles from './style.module.scss';
import { Observable } from 'rxjs';

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
  static defaultProps = defaultProps;

  preventClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const { header, content, footer, maskClick } = this.props;
    return (
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
    );
  }
}

export class ModalService {
  ele: Element[] = [];

  open(options: { title?: string; content: string | ReactNode; }) {
    const { title, content } = options;
    return new Observable(subscribe => {
      const container = document.createElement('div');
      container.className = 'modal-container';
      document.body.appendChild(container);
      ReactDOM.render(
        <Modal
          header={ title }
          content={ content }
          maskClick={e => {
            this.destroy(container);
            subscribe.error();
            subscribe.complete();
          }}
          footer={
            [{
              text: '取消',
              callback: () => {
                this.destroy(container);
                subscribe.error();
                subscribe.complete();
              }
            }, {
              text: '确定',
              callback: () => {
                this.destroy(container);
                subscribe.next();
                subscribe.complete();
              }
            }]
          }
        />,
        container
      );
      this.ele.push(container);
    });
  }
  destroy(ele: Element) {
    ele.remove();
    const index = this.ele.indexOf(ele);
    if (index > -1) {
      this.ele.splice(index, 1);
    }
  }
  destroyAll() {
    this.ele.forEach(el => el.remove());
  }

}

export const modal = new ModalService();
