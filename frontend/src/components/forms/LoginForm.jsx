import { useEffect } from 'react'

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from 'zod';
import { loginService } from '@/services/authService';
import PropTypes from 'prop-types'
import { Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slice/authSlice';


const LoginSchema = z.object({
    email: z.string().email({
        message: 'El correo electrónico no es válido.'
    }),
    password: z.string().min(1, 'La contraseña es requerida.')
})

const initialStateForm = {
    email: '',
    password: '',
}



LoginForm.propTypes = {
    setOpen: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
}
export default function LoginForm({
    open,
    setOpen
}) {

    const dispatch = useDispatch()



    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: initialStateForm
    });


    useEffect(() => {
        form.reset(initialStateForm)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])


    const mutation = useMutation({
        mutationFn: (form) => loginService({
            email: form.email,
            password: form.password,
        }),
        onSuccess: (data) => {
            dispatch(login({
                token: data.data.token,
                nombre: data.data.usuario.nombre,
                email: data.data.usuario.email
            }))
            setOpen(false)
        },
        onError: (e) => {
            console.log(e)
            form.setError('password', {
                type: 'manual',
                message: 'Email o contraseña incorrectos'
            })
        },
    })

    const onSubmit = async (data) => mutation.mutate(data)




    return (


        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Inicia sesion</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 md:px-0 px-4 mt-5"
                    >



                        <FormField
                            control={form.control}
                            name={`email`}
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Correo Electronico</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            disabled={mutation.isPending}
                                            placeholder={`Ingresa tu correo`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`password`}
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            disabled={mutation.isPending}
                                            placeholder={`******`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>

                            <Button
                                size="lg"
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full"
                            >
                                {
                                    (mutation.isPending) ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verificando tus datos
                                        </>
                                    ) : (
                                        <span>
                                            Iniciar sesion
                                        </span>
                                    )}
                            </Button>

                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>







    )
}
