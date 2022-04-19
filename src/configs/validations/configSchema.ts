import Role from 'enums/role.enum';
import ValidationMessage from 'enums/validationMessage';
import { BaseSchema, number, object, ref, string } from 'yup';

const configSchema = object({
  role: string(),
  config: object().when('role', {
    is: (role: string) => role === Role.ShiftManager,
    then: object({
      hoursOfMaxDuration: number()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(0, ValidationMessage.NON_NEGATIVE_NUMBER)
        .integer(),
      minutesBeforeForceFinish: number()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(0, ValidationMessage.NON_NEGATIVE_NUMBER)
        .integer(),
      hoursToSendLockShiftWarningBeforeStart: number()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(0, ValidationMessage.NON_NEGATIVE_NUMBER)
        .integer()
        .when(
          'hoursBeforeShiftStarts',
          (hoursBeforeShiftStarts: number, schema: BaseSchema) =>
            schema.test({
              test: (hoursToSendLockShiftWarningBeforeStart: number) =>
                hoursToSendLockShiftWarningBeforeStart <=
                hoursBeforeShiftStarts,
              message:
                'The time to send lock shift warning must not be after the time a shift starts',
            }),
        ),
      hoursBeforeShiftStarts: number()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(0, ValidationMessage.NON_NEGATIVE_NUMBER)
        .integer(),
      minutesOfMinDuration: number()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(15, 'Min minutes is 15')
        .integer(),
    }),
    otherwise: object({
      examRoomConfig: object({
        reservedStaffCode: string().defined('Reserved staff code is required'),
      }),
      aiConfig: object({
        AIThreshold: number()
          .defined(ValidationMessage.REQUIRED_NUMBER)
          .min(0, min => `Min threshold is ${String(min.value)}`)
          .max(1, max => `Max threshold is ${String(max.value)}`),
      }),
      roomConfig: object({
        floor: object().test(
          'notEmptyObject',
          'Floor options is required',
          (item: { [index: number]: string }) => Object.keys(item).length > 0,
        ),
      }),
    }),
  }),
});

export default configSchema;
