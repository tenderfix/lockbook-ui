import { runInAction, observable } from 'mobx';

/**
 * `waitingFor` properties can be a boolean,
 * or a number in case we want to know which (id) item we are waiting for.
 * (e.g. to gray out the file with id = 3 to indicate that it is getting deleted now)
 */
export type WaitingForValue = number | boolean | number[];

/**
 * Elimates boilerplate code in PageStore actions.
 * Extend it in a PageStore and call in the constructor:
 *
 * ```
 * constructor() {
 *   super({
 *     waitingFor: {
 *       ...
 *     },
 *   });
 * }
 * ```
 *
 * Than you can write instead of:
 * ```
 * loadBuilding(buildingId: number): void {
 *   this.waitingFor.loadBuilding = true;
 *   buildingApi
 *     .getBuilding(buildingId)
 *     .then((response) =>
 *       runInAction(() => {
 *         this.waitingFor.loadBuilding = false;
 *         this.building = response;
 *       })
 *     )
 *     .catch((err) => {
 *       runInAction(() => {
 *         this.waitingFor.loadBuilding = false;
 *         console.error(err);
 *       });
 *     });
 * }
 * ```
 *
 * only this:
 * ```
 * loadBuilding(buildingId: number): void {
 *   this.sendRequest({
 *     request: buildingApi.getBuilding(buildingId),
 *     waitingForKey: 'loadBuilding',
 *     then: (response) => {
 *       this.building = response;
 *     }
 *   })
 * }
 * ```
 */
export abstract class SuperPageStore<WaitingForKey extends string> {
  @observable
  waitingFor: { [key in WaitingForKey]: WaitingForValue };

  /**
   * method from SuperPageStore to send requests, which sets `waitingFor[key]` automatically
   * */
  sendRequest: <T>(params: {
    request: Promise<T>;
    waitingForKey: WaitingForKey;
    /** Value while request is ongoing. Default: `true`. It's also possible to set a number or number[] */
    setWaitingForValueTo?: WaitingForValue;
    /** what happens after request? */
    then?: (response: T) => void;
    catch?: (err: Error) => void;
  }) => void;

  constructor(params: { waitingFor: { [key in WaitingForKey]: WaitingForValue } }) {
    this.waitingFor = params.waitingFor;
    this.sendRequest = this.sendRequestFactory(this.waitingFor);
  }

  /**
   * the actual method which get's called, when `sendRequest` get's called
   */
  private innerSendRequest<T>(params: {
    waitingFor: { [key in WaitingForKey]: WaitingForValue };
    waitingForKey: WaitingForKey;
    request: Promise<T>;
    /** default: true */
    setWaitingForValueTo?: WaitingForValue;
    then?: (response: T) => void;
    catch?: (err: Error) => void;
  }): void {
    this.waitingFor[params.waitingForKey] =
      params.setWaitingForValueTo !== undefined ? params.setWaitingForValueTo : true;
    params.request
      .then((response) => {
        return runInAction(() => {
          this.waitingFor[params.waitingForKey] = false;
          if (params.then !== undefined) {
            params.then(response);
          }
        });
      })
      .catch((err) => {
        runInAction(() => {
          this.waitingFor[params.waitingForKey] = false;
          if (params.catch !== undefined) {
            params.catch(err);
          } else {
            console.error(err);
          }
        });
      });
  }

  /**
   * creates (returns) the `sendRequest()` method for this PageStore.
   */
  private sendRequestFactory(
    /** waitingFor object (observable) of PageStore */
    waitingFor: { [key in WaitingForKey]: WaitingForValue }
  ) {
    return <T>(innerParams: {
      request: Promise<T>;
      waitingForKey: WaitingForKey;
      setWaitingForValueTo?: WaitingForValue;
      then?: (response: T) => void;
      catch?: (err: Error) => void;
    }): void => {
      return this.innerSendRequest<T>({
        waitingFor,
        ...innerParams,
      });
    };
  }
}
