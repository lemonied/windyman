import React, {
  createRef,
  FC,
  forwardRef,
  ForwardRefRenderFunction, RefObject, useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import { CSSTransition } from 'react-transition-group';
import { MultiDataChildren, MultiDataManager, MultiDataSet } from '../picker/core';

interface SelectorProps {
  data: MultiDataSet;
}
const Selector: FC<SelectorProps> = function(props) {
  const { data } = props;

  return (
    <div className={'windy-selector'}>
      {
        data.map((item, key) => (
          <div className={'windy-selector-item'} key={key}>

          </div>
        ))
      }
    </div>
  );
};

export { Selector };

interface SelectorModalProps {
  data: MultiDataSet;
  afterClose?: () => void;
}
interface SelectorModalInstance {
  show(): void;
  hide(): void;
}
export const useSelector = (): SelectorModalInstance => {
  const instance = useRef<SelectorModalInstance>({} as SelectorModalInstance);
  return instance.current;
};
const SelectorModalFc: ForwardRefRenderFunction<SelectorModalInstance, SelectorModalProps> = function(props, ref) {
  const { afterClose, data } = props;

  const [show, setShow] = useState(false);

  const instance = useMemo<SelectorModalInstance>(() => {
    return {
      show() {
        setShow(true);
      },
      hide() {
        setShow(false);
      }
    };
  }, []);
  const onExited = useCallback(() => {
    if (typeof afterClose === 'function') {
      afterClose();
    }
  }, [afterClose]);
  const stopDefault = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  useImperativeHandle(ref, () => {
    return instance;
  });

  return (
    <CSSTransition
      in={show}
      classNames={{
        enter: 'windy-selector-enter',
        enterActive: 'windy-selector-enter-active',
        exit: 'windy-selector-exit',
        exitActive: 'windy-selector-exit-active',
        exitDone: 'windy-selector-exit-done'
      }}
      timeout={300}
      onExited={onExited}
    >
      <div className={'windy-selector-modal-mask'} onClick={instance.hide}>
        <div className={'windy-selector-modal'} onClick={stopDefault}>
          <Selector data={data} />
        </div>
      </div>
    </CSSTransition>
  );
};

const SelectorModal = forwardRef<SelectorModalInstance, SelectorModalProps>(SelectorModalFc);

export class SelectorService {
  ele: Element | null = null;
  dataManager: MultiDataManager;
  ref: RefObject<SelectorModalInstance> | null = null;
  constructor(multi: number) {
    this.dataManager = new MultiDataManager(multi);
  }

  open(data: MultiDataSet | MultiDataChildren = []) {
    this.destroy();
    const container = document.createElement('div');
    container.className = 'windy-selector-container';
    document.body.appendChild(container);
    const ref = this.ref = createRef<SelectorModalInstance>();
    this.dataManager.setData(data);
    ReactDOM.render(
      <SelectorModal ref={ref} afterClose={() => this.destroy()} data={this.dataManager.dataSet} />,
      container,
      () => {
        ref.current?.show();
      }
    );
    this.ele = container;
    return {
      close: () => {
        ref.current?.hide();
      }
    };
  }
  destroy() {
    if (this.ele) {
      ReactDOM.unmountComponentAtNode(this.ele);
      this.ele.remove();
    }
  }
}
