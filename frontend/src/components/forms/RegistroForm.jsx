import { useEffect } from 'react'

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from 'zod';
import { registrarService } from '@/services/authService';
import PropTypes from 'prop-types'
import { Loader2 } from 'lucide-react';
import { Input } from '../ui/input';



const RegistroSchema = z.object({
    name: z.string().min(1, {
        message: 'El nombre es obligatorio.'
    }),
    email: z.string().email({
        message: 'El correo electrónico no es válido.'
    }),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
    password_confirmation: z.string().min(8, 'La confirmación de contraseña debe tener al menos 8 caracteres.'),
})  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden.',
    path: ['password_confirmation'], // Muestra el error en el campo de confirmación de la contraseña.
});

const initialStateForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
}


RegistroForm.propTypes = {
    setOpen: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
}
export default function RegistroForm({
    setOpen,
    open
}) {




    const form = useForm({
        resolver: zodResolver(RegistroSchema),
        defaultValues: initialStateForm
    });


    useEffect(() => {
        form.reset(initialStateForm)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])


    const mutation = useMutation({
        mutationFn: (form) => registrarService({
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation
        }),
        onSuccess: () => {
            setOpen(false)
        },
        onError: (e) => {
            console.log(e)
        },
    })

    const onSubmit = async (data) => mutation.mutate(data)



    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className='overflow-y-auto'>
                <SheetHeader>
                    <SheetTitle>
                        Registrate
                    </SheetTitle>
                    <SheetDescription>
                        Para comprar, primero registrate
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 md:px-0 px-4 mt-5"
                    >


                        <FormField
                            control={form.control}
                            name={`name`}
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={mutation.isPending}
                                            placeholder={`Ingresa tu nombre`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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


                        <FormField
                            control={form.control}
                            name={`password_confirmation`}
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Confirma tu contraseña</FormLabel>
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








                        <div className="w-full flex justify-center space-x-4 p-5 md:p-0">
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
                                            Creando tu cuenta...
                                        </>
                                    ) : (
                                        <span>
                                            Registrarme
                                        </span>
                                    )}
                            </Button>

                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet >
    )
}
