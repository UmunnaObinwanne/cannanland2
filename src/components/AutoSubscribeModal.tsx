"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const FormSchema = z.object({
  firstname: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export default function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  useEffect(() => {
    // Only show modal if user hasn't interacted with it before
    if (!hasUserInteracted) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 120000) // 2 minutes in milliseconds

      return () => clearTimeout(timer)
    }
  }, [hasUserInteracted])

  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
    },
  })

  async function onSubmit({firstname, lastname, email}: z.infer<typeof FormSchema>) {
    setIsSubmitting(true)
    try {
      const emailResponse = await fetch('/api/contact-us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstname,
          lastName: lastname,
          email: email,
        }),
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send welcome email')
      }

      const supabase = createClient()
      const { error } = await supabase.from('subscribers').insert({
        first_name: firstname,
        last_name: lastname,
        email: email,
      })
          
      if (error) throw new Error('Failed to save subscription')

      form.reset()
      setIsOpen(false)
      setHasUserInteracted(true)
      toast.success('Welcome! Check your email for confirmation.')
         
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to process subscription")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setHasUserInteracted(true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            Join Our Community
          </DialogTitle>
          <DialogDescription className="text-center">
            Get the scriptures and teachings directly to your inbox. Join us today.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-4 mt-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="First name" 
                        {...field} 
                        className="h-10"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Last name" 
                        {...field}
                        className="h-10"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Email address" 
                        {...field}
                        className="h-10"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}