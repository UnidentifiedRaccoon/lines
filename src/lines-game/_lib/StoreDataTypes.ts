// eslint-disable-next-line @typescript-eslint/naming-convention
export enum BALL_COLOR {
  EMPTY = 'empty',
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  GREEE = 'green',
  BLUE = 'blue',
  VIOLET = 'violet',
  BLACK = 'black',
}

export const BALL_COLORS = [
  BALL_COLOR.RED,
  BALL_COLOR.ORANGE,
  BALL_COLOR.YELLOW,
  BALL_COLOR.GREEE,
  BALL_COLOR.BLUE,
  BALL_COLOR.VIOLET,
  BALL_COLOR.BLACK,
]

export type FieldType = BALL_COLOR[][]

export type BallPositionType = {
  row: number
  col: number
}

export type SettingsType = {
  width: number
  height: number
}

export type DefaultStateType = {
  field: FieldType
  activeBallPos: BallPositionType
  settings: SettingsType
  timer: number
  score: number
}
