import Role from 'enums/role.enum';
import ValidationMessage from 'enums/validationMessage';
import { BaseSchema, number, object, string } from 'yup';

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
      maxSlotPerExaminee: number()
        .integer()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(1, 'Min slot is 1')
        .max(3, 'Max slots is 3'),
      minutesPerSlot: number()
        .integer()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(10, 'Min minutes per slot is 10')
        .max(4.5 * 60, 'Max minutes per slot is 270'),
      minutesBetweenShifts: number()
        .integer()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(0, 'Min minutes between shifts is 0')
        .max(4.5 * 60, 'Max minutes between shifts is 4 hours 30'),
      start: number()
        .integer()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(6 * 60, 'Min start time is 6:00')
        .max(18 * 60, 'Max start time is 18:00'),
      end: number()
        .integer()
        .defined(ValidationMessage.REQUIRED_NUMBER)
        .min(6 * 60, 'Min start time is 6:00')
        .max(18 * 60, 'Max start time is 18:00'),
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
