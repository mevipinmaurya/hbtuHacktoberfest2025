from tkinter import *
from random import *
#make sure to install pyperclip
# run it using python 
import pyperclip

psd=Tk()
psd.title("GenPa$$")
psd.geometry("600x400")
psd['background']='gray'

output_pass=StringVar()
pass_len=IntVar(value=5)

def genPass():
    password=""

    upperCase="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    lowerCase="abcdefghijklmnopqrstuvwxyz"
    number="0123456789"
    symbol="@#$%^&*()/"

    password+=upperCase[int(random()* len(upperCase))]
    password+=lowerCase[int(random()* len(lowerCase))]
    password+=number[int(random()* len(number))]
    password+=symbol[int(random()* len(symbol))]
    
    allChars= upperCase + lowerCase + number + symbol
    
    for y in range(4,pass_len.get()):
        password+=allChars[int(random()* len(allChars))]

    output_pass.set(password)
    
def copyps():
    password = output_pass.get()
    # print("Password:", password)
    pyperclip.copy(password)
    # print("Copied!")

def reset(): 
    output_pass.set("")


#frame
frame=Frame(psd,relief="sunken", bd=5,bg="#9b69b6")
frame.pack(fill="both",expand=True, padx=10,pady=10)

psdSub=Label(frame,text="Need a Password? Try GenPa$$ Password Generator",font=("arial",15),bg="#9b69b6",fg="white").pack(padx=10,pady=10)
#psd.attributes("-alpha",0.5)

psdCont=Label(frame,text="Generate secure,random,passwords to stay safe online.",font=("arial",9),bg="#9b69b6",fg="white").pack(padx=10,pady=5)

psdCont=Label(frame,text="generate passwords under 5 seconds",font=("arial",5),bg="#9b69b6",fg="white").pack(padx=10,pady=5)

psdEnte=Entry(frame,textvariable=output_pass,width=20,font="arial 12").pack()

length=Spinbox(frame,from_=4,to_=20,textvariable=pass_len,width=15,font="arial 12").pack()

psdBut=Button(frame,text="Generate Password",command=genPass,font=7).pack(padx=10,pady=5)

psdCop=Button(frame,text="Copy to Clipboard",command=copyps,font=7).pack(padx=10,pady=5)

resetBut=Button(frame,text="Reset",command=reset).pack(padx=10,pady=5)

psd.mainloop()