import Role from 'enums/role.enum';
import ValidationMessage from 'enums/validationMessage';
import { number, object, string } from 'yup';

const configSchema = object({
  role: string(),
  config: object().when('role', {
    is: (role: string) => role === Role.ShiftManager,
    then: object({
      hoursOfMaxDuration: number()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(0, ValidationMessage.NUMBER_LARGER_THAN_ZERO)
        .integer(),
      minutesBeforeForceFinish: number()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(0, ValidationMessage.NUMBER_LARGER_THAN_ZERO)
        .integer(),
      hoursToSendLockShiftWarningBeforeStart: number()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(0, ValidationMessage.NUMBER_LARGER_THAN_ZERO)
        .integer(),
      hoursBeforeShiftStarts: number()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(0, ValidationMessage.NUMBER_LARGER_THAN_ZERO)
        .integer(),
      minutesOfMinDuration: number()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(0, ValidationMessage.NUMBER_LARGER_THAN_ZERO)
        .integer(),
    }),
    // TODO: schema for manager setting
    otherwise: object(),
  }),
});

export default configSchema;
