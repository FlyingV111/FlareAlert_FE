import * as echarts from 'echarts/core';
import {LineChart} from 'echarts/charts';
import {GridComponent, TitleComponent, TooltipComponent,} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
]);

export {echarts}
