import {Params} from "@angular/router";
import {ActiveParamsType} from "../types/active-params.type";

export class ActiveParamsUtil {
  /**
   * Возвращает объект с параметрами из url
   * @param params url параметры
   */
  static processParams(params: Params): ActiveParamsType {
    const activeParams: ActiveParamsType = {categories: []};

    // Если url содержит параметр категории
    if (params.hasOwnProperty('categories')) {
      activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
    }

    // Если url содержит параметр страницы
    if (params.hasOwnProperty('page')) {
      activeParams.page = +params['page'];
    }
    return activeParams;
  }
}
