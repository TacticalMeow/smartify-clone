import { BaseProcessorData } from '@smarter/shared';
import React, { FC, useEffect, useState } from 'react';
import { Node } from 'react-flow-renderer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Box } from '@mui/system';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, IconButton, Tooltip, Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { ProcessorsLibrary } from 'screens/Jobs/Processors/library';
import TextParam from 'screens/Jobs/EditProcessor/Params/TextParam';
import { ParamComponentByType } from 'screens/Jobs/EditProcessor/Params';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

type Props = {
    selectedProcessor: Node<BaseProcessorData<any>> | null;
    onClose: () => void;
    open: boolean;
    onUpdate: (nodeId: string, data: any) => void;
    onDelete: (nodeId: string) => void;
}

type AreYouSureProps = {
  onOk: () => void
  onCancel: () => void
  text: JSX.Element
  open: boolean
  buttonText: string
}

const AreYouSure: FC<AreYouSureProps> = ({
  onOk, onCancel, text, open, buttonText,
}) => (
  <Dialog
    open={open}
    onClose={onCancel}
  >
    <DialogTitle id="alert-dialog-title">
      Are you sure?
    </DialogTitle>
    <DialogContent>
      <DialogContentText id={`are-you-sure-dialog-${buttonText}`}>
        {text}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>
        Cancel
      </Button>
      <Button
        color="error"
        autoFocus
        onClick={onOk}
      >
        {buttonText}
      </Button>
    </DialogActions>

  </Dialog>
);

const EditProcessor: FC<Props> = ({
  selectedProcessor, onClose, open, onUpdate, onDelete,
}) => {
  const [isAreYouSureDeleteOpen, setIsAreYouSureDeleteOpen] = useState<boolean>(false);
  const [isAreYouSureExitOpen, setIsAreYouSureExitOpen] = useState<boolean>(false);

  const {
    handleSubmit, reset, control, formState: { isDirty },
  } = useForm({ defaultValues: selectedProcessor?.data });

  const onSubmit = (data: any) => {
    onUpdate(selectedProcessor?.id as string, data);
    onClose();
  };

  const handleClose = () => {
    if (isDirty) {
      setIsAreYouSureExitOpen(true);
    } else {
      reset(selectedProcessor?.data);
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete(selectedProcessor?.id || '');
    setIsAreYouSureDeleteOpen(false);
    handleClose();
  };

  useEffect(() => {
    if (selectedProcessor) {
      reset(selectedProcessor.data);
    }
  }, [selectedProcessor]);

  if (!selectedProcessor) {
    return (
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={onClose}
        onOpen={() => open}
      />
    );
  }

  const { processorId, displayName, params } = selectedProcessor.data;
  const processorConfig = ProcessorsLibrary[processorId];

  return (
    <>
      <AreYouSure
        open={isAreYouSureDeleteOpen}
        onOk={handleDelete}
        onCancel={() => setIsAreYouSureDeleteOpen(false)}
        text={(
          <>
            {' '}
            Are you sure you want to delete
            {' '}
            <b>{displayName}</b>
            ?
          </>
          )}
        buttonText="Delete"
      />

      <AreYouSure
        open={isAreYouSureExitOpen}
        onOk={() => {
          reset(selectedProcessor?.data);
          setIsAreYouSureExitOpen(false);
          onClose();
        }}
        onCancel={() => setIsAreYouSureExitOpen(false)}
        text={(
          <>
            {' '}
            You have unsaved changes, are you sure you want to exit?
          </>
          )}
        buttonText="Exit"
      />

      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={handleClose}
        onOpen={() => open}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 5,
        }}
        >
          <Tooltip title="Delete">
            <IconButton onClick={() => setIsAreYouSureDeleteOpen(true)}>
              <DeleteIcon sx={(theme) => ({ color: (theme.palette.error as any)[500] })} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            width: '300px',
          },
          [theme.breakpoints.up('md')]: {
            width: '350px',
          },
          [theme.breakpoints.up('xl')]: {
            width: '450px',
          },
          [theme.breakpoints.up(2500)]: {
            width: '600px',
          },
          paddingX: 8,
          display: 'flex',
          flexDirection: 'column',
        })}
        >
          <Typography variant={(displayName?.length || 0) > 20 ? 'h4' : 'h3'}>{ selectedProcessor?.data.displayName }</Typography>
          <Typography variant="body2" sx={{ ml: 0.3, mb: 3 }} color="primary">
            Type:
            { ' ' }
            { processorConfig?.processorTypeDisplayName }
          </Typography>
          <Typography variant="body1">{processorConfig?.description}</Typography>
          <form>
            <Box sx={{
              mt: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',

              '& > *:not(:first-child)': {
                width: '100%',
                marginTop: 3,
              },
            }}
            >
              <Typography variant="h6">Parameters</Typography>
              {!processorConfig.displayNameTemplate && (
                <TextParam
                  name="displayName"
                  label="displayName"
                  defaultValue={displayName}
                  control={control as any}
                  description="This is the text that will be displayed on the processor"
                  required
                />
              )}

              {processorConfig?.paramsConfig.map((param) => {
                const {
                  name, description, required, validate, type, ComponentProps, props, rules,
                } = param;
                const Param = ParamComponentByType[type];

                return (
                  <Param
                    key={param.name}
                    control={control as any}
                    label={name}
                    name={`params.${name}`}
                    defaultValue={params[name]}
                    description={description}
                    required={required}
                    validate={validate}
                    props={props as any}
                    ComponentProps={ComponentProps}
                    rules={rules}
                  />
                );
              })}

              <Button
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                sx={{
                  height: '45px',
                }}
              >
                Update
              </Button>
            </Box>
          </form>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default EditProcessor;
