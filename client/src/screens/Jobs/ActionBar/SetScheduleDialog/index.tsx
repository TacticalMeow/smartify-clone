import {
  Box,
  Dialog, Typography, DialogTitle, DialogContent,
  FormControl, Radio, RadioGroup, DialogActions,
  TextField, Select, MenuItem, IconButton,
} from '@mui/material';
import React, {
  FC, useEffect, useState,
} from 'react';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import UpdateIcon from '@mui/icons-material/SystemUpdateAlt';
import moment, { Moment } from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import { smartifyClient } from 'apiClients';
import {
  Endpoints, GetJobSchedulerRequest, GetJobSchedulerResponse, SetJobSchedulerRequest,
} from '@smarter/shared';
import _ from 'lodash';

type Props = {
  open: boolean;
  onClose: () => void;
  jobId: string,
  saveJobToDb: () => Promise<void>;
}

enum SchedulerTypes {
  EveryDay = 'EVERY_DAY',
  EveryWeek = 'EVERY_WEEK',
  Nothing ='NOTHING'
}

const SetScheduleDialog: FC<Props> = ({
  open, onClose, jobId, saveJobToDb,
}) => {
  const [startDate, setStartDate] = useState<Moment | null>(moment().add(1, 'day'));
  const [endDate, setEndDate] = useState<Moment | null>(moment().add(1, 'year'));
  const [everyDayAt, setEveryDayAt] = useState<Moment | null>(moment());
  const [dayOfWeek, setDayOfWeek] = useState<number>(moment().weekday());
  const [schedulerType, setSchedulerType] = useState(SchedulerTypes.Nothing);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const getJobScheduler = async () => {
    const response = await smartifyClient
      .get<GetJobSchedulerRequest, GetJobSchedulerResponse>(
        Endpoints.getJobScheduler,
        { params: { jobId } },
      );

    const { data } = response;

    if (data.endDate) {
      setEndDate(moment(data.endDate));
    }
    if (data.nextRun) {
      setStartDate(moment(data.nextRun));
      setEveryDayAt(moment(data.nextRun));
    }
    if (data.interval) {
      const type = _.last(data.interval) === '*' ? SchedulerTypes.EveryDay : SchedulerTypes.EveryWeek;
      setSchedulerType(type);

      if (type === SchedulerTypes.EveryWeek) {
        setDayOfWeek(moment(data.nextRun).weekday());
      }
    }
  };

  useEffect(() => {
    if (jobId) {
      getJobScheduler();
    }
  }, [jobId]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSchedulerType(event.target.value as unknown as SchedulerTypes);
  };

  const handleClick = async () => {
    setLoading(true);

    try {
      await saveJobToDb();

      if (schedulerType === SchedulerTypes.Nothing) {
        await smartifyClient.post<SetJobSchedulerRequest>(Endpoints.setJobScheduler, {
          jobId,
        });

        setTimeout(() => {
          setLoading(false);
        }, 1000);

        return true;
      }

      const interval = schedulerType === SchedulerTypes.EveryDay
        ? `0 ${everyDayAt?.minutes()} ${everyDayAt?.hours()} * * *`
        : `0 ${everyDayAt?.minutes()} ${everyDayAt?.hours()} * * ${dayOfWeek}`;

      await smartifyClient.post<SetJobSchedulerRequest>(Endpoints.setJobScheduler, {
        jobId,
        interval,
        startDate: startDate?.format('YYYY-MM-DD'),
        endDate: endDate?.format('YYYY-MM-DD'),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      setTimeout(() => {
        setLoading(false);
      }, 1000);

      setIsError(false);
      onClose();

      return true;
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      setIsError(true);

      return false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
    >
      <Box>
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        >
          Set Schedule
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',

              '& > *': {
                margin: 1,
              },
            }}
          >
            <Box sx={{ marginBottom: 2 }}>
              <FormControl sx={{ width: '100%' }}>
                <RadioGroup
                  aria-labelledby="pick-interval"
                  defaultValue="no-interval"
                  name="radio-buttons-group"
                >
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',

                    '& > *': {
                      marginY: 1,
                    },
                  }}
                  >
                    <Radio
                      checked={schedulerType === SchedulerTypes.EveryDay}
                      value={SchedulerTypes.EveryDay}
                      name="radio-buttons"
                      onChange={handleRadioChange}
                    />
                    <Typography>Run every day at</Typography>
                    <Box padding={1}>
                      <TimePicker
                        label=""
                        value={schedulerType === SchedulerTypes.EveryDay ? everyDayAt : null}
                        onChange={(newValue) => {
                          setEveryDayAt(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        ampm={false}
                        disabled={schedulerType !== SchedulerTypes.EveryDay}
                      />
                    </Box>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  >
                    <Radio
                      checked={schedulerType === SchedulerTypes.EveryWeek}
                      value={SchedulerTypes.EveryWeek}
                      name="radio-buttons"
                      onChange={handleRadioChange}
                    />
                    <Typography>Run every</Typography>
                    <FormControl sx={{ padding: 1 }}>
                      <Select
                        labelId="day-of-week-label"
                        id="day-of-week-select"
                        value={dayOfWeek}
                        disabled={schedulerType !== SchedulerTypes.EveryWeek}
                        onChange={(event) => setDayOfWeek(Number(event.target.value))}
                      >
                        <MenuItem value={0}>Sunday</MenuItem>
                        <MenuItem value={1}>Monday</MenuItem>
                        <MenuItem value={2}>Tuesday</MenuItem>
                        <MenuItem value={3}>Wednesday</MenuItem>
                        <MenuItem value={4}>Thursday</MenuItem>
                        <MenuItem value={5}>Friday</MenuItem>
                        <MenuItem value={6}>Saturday</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography>at</Typography>
                    <Box padding={1}>
                      <TimePicker
                        label=""
                        value={schedulerType === SchedulerTypes.EveryWeek ? everyDayAt : null}
                        onChange={(newValue) => {
                          setEveryDayAt(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        ampm={false}
                        disabled={schedulerType !== SchedulerTypes.EveryWeek}
                      />
                    </Box>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  >
                    <Radio
                      checked={schedulerType === SchedulerTypes.Nothing}
                      value={SchedulerTypes.Nothing}
                      name="radio-buttons"
                      onChange={handleRadioChange}
                    />
                    <Typography>No Scheduler</Typography>
                  </Box>
                </RadioGroup>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="subtitle1">Next Run:</Typography>
              <Box display="flex" padding={1}>
                <DatePicker
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                  minDate={moment()}
                  renderInput={(params) => <TextField {...params} />}
                  disabled={schedulerType === SchedulerTypes.Nothing}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle1">The last run will be at:</Typography>
              <Box display="flex" padding={1}>
                <DatePicker
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  minDate={startDate}
                  maxDate={moment(startDate).add(1, 'year')}
                  disabled={schedulerType === SchedulerTypes.Nothing}
                />
              </Box>
              <Typography variant="caption">Note: by default the scheduler stop running after one year from the last update</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            variant="outlined"
            sx={{ margin: 3 }}
            startIcon={<UpdateIcon />}
            onClick={handleClick}
          >
            Update
          </LoadingButton>
        </DialogActions>
        {isError && (
          <Box display="flex" justifyContent="center" alignItems="center" paddingBottom={4}>
            <Typography color="error">
              Something went wrong please try again later
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default SetScheduleDialog;
